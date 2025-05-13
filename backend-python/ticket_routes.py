from flask import Blueprint, request, jsonify
from utils import execute_query, success_response, error_response

ticket_routes = Blueprint('ticket_routes', __name__)

@ticket_routes.route('/tickets', methods=['POST'])
def create_ticket():
    data = request.json
    try:
        ticket_id = execute_query(
            """INSERT INTO ingressos (evento_id, tipo, preco) 
            VALUES (%s, %s, %s)""",
            (data.get('evento_id'), data.get('tipo'), data.get('preco'))
        )
        ticket_id = execute_query("SELECT LAST_INSERT_ID()", fetch_one=True)[0]
        return success_response("Ingresso cadastrado com sucesso", {"ticketId": ticket_id})
    except Exception as e:
        return error_response("Erro ao cadastrar ingresso", e)

@ticket_routes.route('/tickets/<int:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    try:
        ticket = execute_query(
            "SELECT id, tipo, preco, quantidade_disponivel, data_inicio, data_final, evento_id FROM ingressos WHERE id = %s",
            (ticket_id,),
            fetch_one=True
        )
        if not ticket:
            return error_response("Ingresso não encontrado", status_code=404)
        ticket_data = {
            "id": ticket[0],
            "tipo": ticket[1],
            "preco": ticket[2],
            "quantidade_disponivel": ticket[3],
            "data_inicio": ticket[4].isoformat() if ticket[4] else None,
            "data_final": ticket[5].isoformat() if ticket[5] else None,
            "evento_id": ticket[6]
        }
        return success_response("Ingresso encontrado com sucesso", {"ticket": ticket_data})
    except Exception as e:
        return error_response("Erro ao buscar ingresso", e)

@ticket_routes.route('/tickets/<int:ticket_id>', methods=['PUT'])
def update_ticket(ticket_id):
    data = request.json
    try:
        execute_query(
            """UPDATE ingressos SET tipo = %s, preco = %s, quantidade_disponivel = %s, data_inicio = %s, data_final = %s WHERE id = %s""",
            (data.get('tipo'), data.get('preco'), data.get('quantidade_disponivel'), data.get('data_inicio'), data.get('data_final'), ticket_id)
        )
        return success_response("Ingresso atualizado com sucesso")
    except Exception as e:
        return error_response("Erro ao atualizar ingresso", e)

@ticket_routes.route('/tickets/reserve', methods=['POST'])
def reserve_ticket():
    data = request.json
    try:
        user_email = data.get('email')
        user_password = data.get('password')

        if not user_email or not user_password:
            return error_response("Email e senha são necessários para login ou cadastro.", status_code=400)

        user = execute_query("SELECT * FROM usuarios WHERE email = %s", (user_email,), fetch_one=True)

        if user:
            if user[3] != user_password:
                return error_response("Credenciais inválidas.", status_code=401)
        else:
            new_user_data = {
                'nome': data.get('nome'),
                'email': user_email,
                'password': user_password,
                'cpf': data.get('cpf'),
                'telefone': data.get('telefone'),
                'data_nascimento': data.get('data_nascimento'),
                'cidade': data.get('cidade'),
                'estado': data.get('estado')
            }

            execute_query(
                """INSERT INTO usuarios (nome, email, senha, cpf, telefone, data_nascimento, cidade, estado) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (new_user_data['nome'], new_user_data['email'], new_user_data['password'], new_user_data['cpf'],
                 new_user_data['telefone'], new_user_data['data_nascimento'], new_user_data['cidade'], new_user_data['estado'])
            )

            user_id = execute_query("SELECT LAST_INSERT_ID()", fetch_one=True)[0]

        ticket_id = data.get('ticket_id')
        if not ticket_id:
            return error_response("ID do ingresso é necessário.", status_code=400)

        ticket = execute_query("SELECT quantidade_disponivel FROM ingressos WHERE id = %s", (ticket_id,), fetch_one=True)

        if not ticket or ticket[0] <= 0:
            return error_response("Ingresso indisponível.", status_code=400)

        execute_query(
            """UPDATE ingressos SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = %s""",
            (ticket_id,)
        )

        return success_response("Ingresso reservado com sucesso")
    except Exception as e:
        return error_response("Erro ao reservar ingresso", e)

@ticket_routes.route('/api/participant/tickets', methods=['GET'])
def get_participant_tickets():
    try:
        # Simulando dados de tickets para participantes
        tickets = [
            {"id": 1, "eventName": "Evento A", "date": "2025-05-10", "seat": "A1"},
            {"id": 2, "eventName": "Evento B", "date": "2025-06-15", "seat": "B2"}
        ]
        return jsonify({"tickets": tickets}), 200
    except Exception as e:
        return jsonify({"error": "Erro ao buscar tickets", "details": str(e)}), 500