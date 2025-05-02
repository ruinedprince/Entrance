from flask import Blueprint, request
from utils import execute_query, success_response, error_response

event_routes = Blueprint('events', __name__)

@event_routes.route('/events', methods=['POST'])
def create_event():
    data = request.json
    try:
        event_id = execute_query(
            """INSERT INTO eventos (nome, descricao, data_inicio, data_final, local, organizador_id, status) 
            VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (data.get('nome'), data.get('descricao'), data.get('data_inicio'), data.get('data_final'), data.get('local'), data.get('organizador_id'), data.get('status')),
            fetch_one=True
        )[0]
        return success_response("Evento cadastrado com sucesso", {"eventId": event_id})
    except Exception as e:
        return error_response("Erro ao cadastrar evento", e)

@event_routes.route('/events', methods=['GET'])
def get_events():
    try:
        events = execute_query("SELECT id, nome, descricao, data_inicio, data_final, local, organizador_id, status FROM eventos", fetch_all=True)
        events_list = [
            {
                "id": event[0],
                "nome": event[1],
                "descricao": event[2],
                "data_inicio": event[3],
                "data_final": event[4],
                "local": event[5],
                "organizador_id": event[6],
                "status": event[7]
            }
            for event in events
        ]
        return success_response("Eventos buscados com sucesso", {"events": events_list})
    except Exception as e:
        return error_response("Erro ao buscar eventos", e)

@event_routes.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
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
        return error_response("Erro ao buscar evento", e)

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
        return error_response("Erro ao buscar ingressos", e)