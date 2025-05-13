from flask import Flask
from flask import Blueprint, request, jsonify, current_app as app
import os
from werkzeug.utils import secure_filename
from utils import execute_query, success_response, error_response
from db_connection import get_db_connection

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
            slug = data.get('nome').lower().replace(' ', '-').replace('/[^a-z0-9-]/g', '')
            execute_query(
                """INSERT INTO eventos (nome, descricao, data_inicio, data_final, local, organizador_id, status, capa, cidade, estado, slug) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (data.get('nome'), data.get('descricao'), data.get('data_inicio'), data.get('data_final'), data.get('local'), data.get('organizador_id'), data.get('status'), data.get('capa'), data.get('cidade'), data.get('estado'), slug)
            )
            event_id = execute_query("SELECT LAST_INSERT_ID()", fetch_one=True)[0]
            return success_response("Evento cadastrado com sucesso", {"eventId": event_id})
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print("Erro ao cadastrar evento:", error_details)
            return error_response("Erro ao cadastrar evento", {"details": str(e)})
    elif request.method == 'GET':
        try:
            events = execute_query("SELECT id, nome, descricao, data_inicio, data_final, local, organizador_id, status, capa, cidade, estado, slug FROM eventos", fetch_all=True)
            print("Eventos retornados pelo banco de dados:", events)
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
                    "estado": event[10],
                    "slug": event[11],
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

        query = "SELECT id, nome, descricao, data_inicio, data_final, local, cidade, estado, capa, slug FROM eventos WHERE 1=1"
        params = []

        if city:
            query += " AND cidade = %s"
            params.append(city)

        if date:
            query += " AND DATE(data_inicio) = %s"
            params.append(date)

        query += f" ORDER BY data_inicio {order.upper()}"

        events = execute_query(query, tuple(params), fetch_all=True)
        print("Query result:", events)  # Log the raw query result for debugging

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
                "capa": event[8],
                "slug": event[9]
            }
            for event in events
        ]
        print("Formatted events list:", events_list)  # Log the formatted events list

        return success_response("Eventos listados com sucesso", {"events": events_list})
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print("Erro ao listar eventos:", error_details)
        return error_response("Erro ao listar eventos", {"details": str(e)})

@event_routes.route('/events/<int:event_id>', methods=['GET'])
def get_event_details(event_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Busca os detalhes do evento
        cursor.execute("SELECT * FROM events WHERE id = %s", (event_id,))
        event = cursor.fetchone()

        if not event:
            return jsonify({"error": "Evento não encontrado"}), 404

        event_data = {
            "id": event[0],
            "descricao": event[1],
            "local": event[2],
            "organizador_id": event[3],
            "nome": event[4],
            "data_inicio": event[5].isoformat(),
            "data_final": event[6].isoformat(),
            "status": event[7],
            "capa": event[8],
            "cidade": event[9],
            "estado": event[10],
            "slug": event[11],
        }

        return jsonify(event_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        connection.close()

@event_routes.route('/events/slug/<slug>', methods=['GET'])
def get_event_details_by_slug(slug):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Busca os detalhes do evento pelo slug
        cursor.execute("SELECT * FROM eventos WHERE slug = %s", (slug,))
        event = cursor.fetchone()

        if not event:
            return jsonify({"error": "Evento não encontrado"}), 404

        event_data = {
            "id": event[0],
            "descricao": event[1],
            "local": event[2],
            "organizador_id": event[3],
            "nome": event[4],
            "data_inicio": event[5].isoformat(),
            "data_final": event[6].isoformat(),
            "status": event[7],
            "capa": event[8],
            "cidade": event[9],
            "estado": event[10],
            "slug": event[11],
        }

        return jsonify(event_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        connection.close()

@event_routes.route('/events/generate-slugs', methods=['POST'])
def generate_slugs():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Seleciona eventos sem slug
        cursor.execute("SELECT id, nome FROM eventos WHERE slug IS NULL")
        events = cursor.fetchall()

        for event in events:
            event_id, event_name = event
            slug = event_name.lower().replace(" ", "-").replace("/[^a-z0-9-]/g", "")
            cursor.execute("UPDATE eventos SET slug = %s WHERE id = %s", (slug, event_id))

        connection.commit()
        return jsonify({"message": "Slugs gerados com sucesso."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        connection.close()

@event_routes.route('/events/missing-slugs', methods=['GET'])
def get_events_missing_slugs():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Seleciona eventos sem slug
        cursor.execute("SELECT id, nome FROM eventos WHERE slug IS NULL")
        events = cursor.fetchall()

        events_list = [
            {"id": event[0], "nome": event[1]} for event in events
        ]

        return jsonify(events_list)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        connection.close()

@event_routes.route('/fix-missing-slugs', methods=['POST'])
def fix_missing_slugs():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Selecionar eventos sem slug
        cursor.execute("SELECT id, nome FROM eventos WHERE slug IS NULL")
        eventos_sem_slug = cursor.fetchall()

        for evento in eventos_sem_slug:
            event_id, nome = evento
            slug = nome.lower().replace(' ', '-').replace('/[^a-z0-9-]/g', '')
            cursor.execute("UPDATE eventos SET slug = %s WHERE id = %s", (slug, event_id))

        connection.commit()
        return jsonify({"message": "Slugs gerados para eventos sem slug."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        connection.close()