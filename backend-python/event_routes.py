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

@event_routes.route('/events/register', methods=['POST'])
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

        os.makedirs(os.path.dirname(upload_path), exist_ok=True)

        try:
            file.save(upload_path)
        except Exception as e:
            return jsonify({"error": "Erro ao salvar o arquivo."}), 500

        return jsonify({"path": f"/uploads/eventos/capa/{filename}"}), 200

    return jsonify({"error": "Arquivo não permitido."}), 400

@event_routes.route('/events/list', methods=['GET'])
def list_events():
    try:
        city = request.args.get('city', '')
        date = request.args.get('date', '')
        order = request.args.get('order', 'asc')

        query = "SELECT id, nome, descricao, data_inicio, data_final, local, cidade, estado, capa FROM eventos WHERE 1=1"
        params = []

        if city:
            query += " AND cidade = %s"
            params.append(city)

        if date:
            query += " AND DATE(data_inicio) = %s"
            params.append(date)

        query += f" ORDER BY data_inicio {order.upper()}"

        events = execute_query(query, tuple(params), fetch_all=True)

        events_list = [
            {
                "id": event[0],
                "nome": event[1],
                "descricao": event[2],
                "data_inicio": event[3].isoformat() if event[3] else None,
                "data_final": event[4].isoformat() if event[4] else None,
                "local": event[5],
                "cidade": event[6],
                "estado": event[7],
                "capa": event[8]
            }
            for event in events
        ]

        return success_response("Eventos listados com sucesso", {"events": events_list})
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print("Erro ao listar eventos:", error_details)
        return error_response("Erro ao listar eventos", {"details": str(e)})