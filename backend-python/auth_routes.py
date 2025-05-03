from flask import Blueprint, request
from utils import execute_query, success_response, error_response
from bcrypt import checkpw, hashpw, gensalt
from db_connection import cursor

auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    print(f"Received data: {data}")  # Debugging input data
    try:
        hashed_password = hashpw(data['password'].encode('utf-8'), gensalt()).decode('utf-8')
        print(f"Generated hashed password: {hashed_password}")  # Log the hashed password
    except Exception as hash_error:
        print(f"Error hashing password: {hash_error}")  # Debugging password hashing
        return error_response("Error hashing password", hash_error)

    try:
        print(f"Hash antes da inserção: {hashed_password}")  # Log do hash antes da inserção
        user_id = execute_query(
            """INSERT INTO usuarios (nome, email, senha, cpf, telefone, data_nascimento, cidade, estado, tipo_usuario) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (data['nome'], data['email'], hashed_password, data['cpf'], data['telefone'], data['data_nascimento'], data['cidade'], data['estado'], data['tipo_usuario']),
            fetch_one=True
        )
        print(f"Hash armazenado no banco: {hashed_password}")  # Log do hash armazenado
        print(f"Returned user_id: {user_id}")  # Log the returned user_id
        if user_id is None:
            raise Exception("No ID returned from the database.")
        user_id = user_id[0]  # Access the ID from the returned tuple
    except Exception as db_error:
        print(f"Database error: {db_error}")  # Log the database error
        return error_response("Error registering user", db_error)

    try:
        cursor.execute("SELECT current_database();")
        current_db = cursor.fetchone()[0]
        print(f"Current database: {current_db}")  # Log the current database name
    except Exception as db_error:
        print(f"Error fetching current database: {db_error}")  # Log any errors fetching the database name

    return success_response("User registered successfully", {"id": user_id})

@auth_routes.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    try:
        user = execute_query("SELECT id, nome, email, senha, tipo_usuario FROM usuarios WHERE email = %s", (data['email'],), fetch_one=True)
        if not user:
            return error_response("Invalid credentials", status_code=401)

        print(f"Received email: {data['email']}, password: {data['password']}")  # Debugging input
        print(f"Database user: {user}")  # Debugging database result
        print(f"Valor de tipo_usuario retornado: {user[4]}")  # Log do tipo_usuario retornado

        if not checkpw(data['password'].encode('utf-8'), user[3].encode('utf-8')):
            return error_response("Invalid credentials", status_code=401)

        return success_response("Login successful", {"id": user[0], "name": user[1], "email": user[2], "role": user[4]})
    except Exception as e:
        print(f"Error during login: {e}")  # Log the error
        return error_response("Error during login", e)