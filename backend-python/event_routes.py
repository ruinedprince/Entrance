from flask import Flask
from flask import Blueprint, request, jsonify, current_app as app
import os
from werkzeug.utils import secure_filename
from utils import execute_query, success_response, error_response
from app import get_db_connection

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

event_routes = Blueprint('events', __name__)

@event_routes.route('/events', methods=['POST', 'GET'])
def events():
    if request.method == 'POST':
        data = request.json
        try:
            event_id = execute_query(
                """INSERT INTO eventos (nome, descricao, data_inicio, data_final, local, organizador_id, status, capa, cidade, estado) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (data.get('nome'), data.get('descricao'), data.get('data_inicio'), data.get('data_final'), data.get('local'), data.get('organizador_id'), data.get('status'), data.get('capa'), data.get('cidade'), data.get('estado')),
                fetch_one=True
            )[0]
            return success_response("Evento cadastrado com sucesso", {"eventId": event_id})
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print("Erro ao cadastrar evento:", error_details)
            return error_response("Erro ao cadastrar evento", {"details": str(e)})
    elif request.method == 'GET':
        try:
            events = execute_query("SELECT id, nome, descricao, data_inicio, data_final, local, organizador_id, status, capa, cidade, estado FROM eventos", fetch_all=True)
            events_list = [
                {
                    "id": event[0],
                    "nome": event[1],
                    "descricao": event[2],
                    "data_inicio": event[3].isoformat() if event[3] else None,
                    "data_final": event[4].isoformat() if event[4] else None,
                    "local": event[5],
                    "organizador_id": event[6],
                    "status": event[7],
                    "capa": event[8],
                    "cidade": event[9],
                    "estado": event[10]
                }
                for event in events
            ]
            print("Eventos retornados:", events_list)  # Log para depuração
            return success_response("Eventos buscados com sucesso", {"events": events_list})
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print("Erro ao buscar eventos:", error_details)
            return error_response("Erro ao buscar eventos", {"details": str(e)})

@event_routes.route('/events/<int:event_id>', methods=['GET'])
def event_details(event_id):
    try:
        event = execute_query("SELECT id, nome, descricao, data_inicio, data_final, local, organizador_id, status FROM eventos WHERE id = %s", (event_id,), fetch_one=True)
        if not event:
            return error_response("Evento não encontrado", status_code=404)
        event_data = {
            "id": event[0],
            "nome": event[1],
            "descricao": event[2],
            "data_inicio": event[3],
            "data_final": event[4],
            "local": event[5],
            "organizador_id": event[6],
            "status": event[7]
        }
        return success_response("Evento buscado com sucesso", {"event": event_data})
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print("Erro ao buscar evento:", error_details)
        return error_response("Erro ao buscar evento", {"details": str(e)})

@event_routes.route('/events/<int:event_id>/tickets', methods=['GET'])
def get_event_tickets(event_id):
    try:
        tickets = execute_query("SELECT id, tipo, preco, quantidade_disponivel, data_inicio, data_final FROM ingressos WHERE evento_id = %s", (event_id,), fetch_all=True)
        tickets_list = [
            {
                "id": ticket[0],
                "tipo": ticket[1],
                "preco": ticket[2],
                "quantidade_disponivel": ticket[3],
                "data_inicio": ticket[4].isoformat() if ticket[4] else None,
                "data_final": ticket[5].isoformat() if ticket[5] else None
            }
            for ticket in tickets
        ]
        return success_response("Ingressos buscados com sucesso", {"tickets": tickets_list})
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print("Erro ao buscar ingressos:", error_details)
        return error_response("Erro ao buscar ingressos", {"details": str(e)})

@event_routes.route('/events', methods=['GET', 'OPTIONS'])
def get_events():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
        SELECT 
            capa, 
            nome, 
            data_inicio, 
            TIME(data_inicio) as horario_inicio, 
            cidade, 
            estado 
        FROM eventos
        ORDER BY data_inicio ASC
        """

        cursor.execute(query)
        events = cursor.fetchall()

        result = [
            {
                "capa": f"/uploads{event[0]}",
                "nome": event[1],
                "data_inicio": event[2],
                "horario_inicio": str(event[3]),
                "cidade": event[4],
                "estado": event[5]
            }
            for event in events
        ]

        cursor.close()
        conn.close()

        return jsonify({"events": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@event_routes.route('/events/upcoming', methods=['GET', 'OPTIONS'])
def get_upcoming_events():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    try:
        events = execute_query("SELECT * FROM eventos WHERE data_inicio >= NOW() ORDER BY data_inicio ASC", fetch_all=True)
        return success_response("Upcoming events fetched successfully", {"events": events})
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print("Error fetching upcoming events:", error_details)
        return error_response("Error fetching upcoming events", {"details": str(e)})

@event_routes.route('/events/total', methods=['GET'])
def get_total_events():
    try:
        total = execute_query("SELECT COUNT(*) FROM eventos", fetch_one=True)[0]
        return success_response("Total events count fetched successfully", {"total": total})
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print("Error fetching total events count:", error_details)
        return error_response("Error fetching total events count", {"details": str(e)})

@event_routes.route('/reverse-geocode', methods=['GET', 'OPTIONS'])
def reverse_geocode():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    if not latitude or not longitude:
        return error_response("Latitude and longitude are required", status_code=400)

    # Simulação de geocodificação reversa
    try:
        location = {
            "principalSubdivision": "São Paulo",
            "country": "Brasil"
        }
        return success_response("Location fetched successfully", location)
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print("Error fetching location:", error_details)
        return error_response("Error fetching location", {"details": str(e)})

@event_routes.route('/events/upload', methods=['POST'])
def upload_event_cover():
    if 'file' not in request.files or 'event_id' not in request.form:
        return jsonify({"error": "Arquivo ou ID do evento não fornecido."}), 400

    file = request.files['file']
    event_id = request.form['event_id']

    if file.filename == '':
        return jsonify({"error": "Nome do arquivo inválido."}), 400

    if file and allowed_file(file.filename):
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = secure_filename(f"{timestamp}_{file.filename}")
        upload_path = os.path.join(UPLOAD_FOLDER, 'eventos', 'capa', filename)
        
        # Criar diretório se não existir
        os.makedirs(os.path.dirname(upload_path), exist_ok=True)
        
        # Adicionar logs para depuração
        print(f"Recebendo arquivo: {file.filename}")
        print(f"Caminho de upload: {upload_path}")

        try:
            file.save(upload_path)
            print(f"Arquivo salvo com sucesso em: {upload_path}")
        except Exception as e:
            print(f"Erro ao salvar o arquivo: {e}")
            return jsonify({"error": "Erro ao salvar o arquivo."}), 500

        # Retornar o caminho relativo para salvar no banco de dados
        return jsonify({"path": f"/uploads/eventos/capa/{filename}"}), 200

    return jsonify({"error": "Arquivo não permitido."}), 400