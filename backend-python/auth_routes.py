from flask import Blueprint, request, jsonify
from utils import execute_query, success_response, error_response, decode_token
from bcrypt import checkpw, hashpw, gensalt
import jwt
from db_connection import cursor
import datetime

SECRET_KEY = "your_secret_key"  # Replace with your actual secret key

auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.json
    print("Received registration data:", data)  # Log incoming data

    # Validate required fields
    required_fields = [
        'nome', 'sobrenome', 'email', 'confirmacao_email', 'password', 'confirmacao_senha',
        'cpf', 'telefone', 'data_nascimento', 'cep', 'endereco', 'cidade', 'estado', 'tipo_usuario'
    ]
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        print("Missing fields:", missing_fields)  # Log missing fields
        return error_response(f"Missing fields: {', '.join(missing_fields)}")

    # Check email and password confirmation
    if data['email'] != data['confirmacao_email']:
        print("Email and confirmation email do not match")  # Log mismatch
        return error_response("Email and confirmation email do not match")
    if data['password'] != data['confirmacao_senha']:
        print("Password and confirmation password do not match")  # Log mismatch
        return error_response("Password and confirmation password do not match")

    try:
        hashed_password = hashpw(data['password'].encode('utf-8'), gensalt()).decode('utf-8')
        print("Password hashed successfully:", hashed_password)  # Log the generated hash
    except Exception as hash_error:
        print("Error hashing password:", hash_error)  # Log hashing error
        return error_response("Error hashing password", hash_error)

    try:
        user_id = execute_query(
            """INSERT INTO usuarios (nome, sobrenome, email, senha, cpf, telefone, data_nascimento, cep, endereco, cidade, estado, tipo_usuario) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (
                data['nome'], data['sobrenome'], data['email'], hashed_password, data['cpf'],
                data['telefone'], data['data_nascimento'], data['cep'], data['endereco'],
                data['cidade'], data['estado'], data['tipo_usuario']
            ),
            fetch_one=True
        )
        if user_id is None:
            raise Exception("No ID returned from the database.")
        user_id = user_id[0]
        print("User registered successfully with ID:", user_id)  # Log successful registration
    except Exception as db_error:
        print("Error registering user:", db_error)  # Log database error
        return error_response("Error registering user", db_error)

    return success_response("User registered successfully", {"id": user_id})

@auth_routes.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 204

    data = request.json
    email = data.get('email')
    password = data.get('password')

    print("Login attempt with email:", email)  # Log email being used

    try:
        cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user:
            print("User found in database:", user)  # Log user data
        else:
            print("No user found with email:", email)  # Log missing user

        if user:
            print("Provided password:", password)  # Log provided password
            print("Stored hash:", user[3])  # Log stored hash

        if user and checkpw(password.encode('utf-8'), user[3].encode('utf-8')):
            print("Password match successful")  # Log password match
            token = jwt.encode({
                "user_id": user[0],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            }, SECRET_KEY, algorithm="HS256")
            return jsonify({"message": "Login bem-sucedido", "token": token, "user": user, "role": user[10]})
        else:
            print("Invalid credentials provided")  # Log invalid credentials
            return jsonify({"error": "Credenciais inválidas"}), 401
    except Exception as e:
        print("Error during login process:", str(e))  # Log exception
        return jsonify({"error": str(e)}), 500

@auth_routes.route('/me', methods=['GET'])
def me():
    token = request.headers.get('Authorization')
    if not token:
        return error_response("Token is missing", status_code=401)

    try:
        # Decode the token (replace with your JWT decoding logic)
        user_id = decode_token(token.replace("Bearer ", ""))['user_id']
        user = execute_query("SELECT id, nome, email, telefone, tipo_usuario FROM usuarios WHERE id = %s", (user_id,), fetch_one=True)

        if not user:
            return error_response("User not found", status_code=404)

        return success_response("User data retrieved successfully", {
            "id": user[0],
            "nome": user[1],
            "email": user[2],
            "telefone": user[3],
            "tipo_usuario": user[4]
        })
    except Exception as e:
        return error_response("Invalid token", e, status_code=401)