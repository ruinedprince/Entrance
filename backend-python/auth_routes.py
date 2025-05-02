from flask import Blueprint, request
from utils import execute_query, success_response, error_response

auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    try:
        user_id = execute_query(
            """INSERT INTO usuarios (nome, email, senha, cpf, telefone, data_nascimento, cidade, estado) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (data['nome'], data['email'], data['password'], data['cpf'], data['telefone'], data['data_nascimento'], data['cidade'], data['estado']),
            fetch_one=True
        )[0]
        return success_response("User registered successfully", {"id": user_id})
    except Exception as e:
        return error_response("Error registering user", e)

@auth_routes.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    try:
        user = execute_query("SELECT * FROM usuarios WHERE email = %s", (data['email'],), fetch_one=True)
        if not user or user[3] != data['password']:
            return error_response("Invalid credentials", status_code=401)
        return success_response("Login successful")
    except Exception as e:
        return error_response("Error logging in", e)