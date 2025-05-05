from flask import Blueprint, request
from utils import execute_query, success_response, error_response
from bcrypt import checkpw, hashpw, gensalt

auth_routes = Blueprint('auth_routes', __name__)

@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.json
    try:
        hashed_password = hashpw(data['password'].encode('utf-8'), gensalt()).decode('utf-8')
    except Exception as hash_error:
        return error_response("Error hashing password", hash_error)

    try:
        user_id = execute_query(
            """INSERT INTO usuarios (nome, email, senha, cpf, telefone, data_nascimento, cidade, estado, tipo_usuario) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (data['nome'], data['email'], hashed_password, data['cpf'], data['telefone'], data['data_nascimento'], data['cidade'], data['estado'], data['tipo_usuario']),
            fetch_one=True
        )
        if user_id is None:
            raise Exception("No ID returned from the database.")
        user_id = user_id[0]
    except Exception as db_error:
        return error_response("Error registering user", db_error)

    return success_response("User registered successfully", {"id": user_id})

@auth_routes.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 204

    data = request.json
    try:
        user = execute_query("SELECT id, nome, email, senha, tipo_usuario FROM usuarios WHERE email = %s", (data['email'],), fetch_one=True)
        if not user:
            return error_response("Invalid credentials", status_code=401)

        if not checkpw(data['password'].encode('utf-8'), user[3].encode('utf-8')):
            return error_response("Invalid credentials", status_code=401)

        return success_response("Login successful", {"id": user[0], "name": user[1], "email": user[2], "role": user[4]})
    except Exception as e:
        return error_response("Error during login", e)