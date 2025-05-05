from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import execute_query, success_response, error_response
from db_connection import cursor

app = Flask(__name__)
CORS(app)

@app.route('/users', methods=['GET'])
def get_users():
    try:
        print("Checking database connection...")
        users = execute_query("SELECT id, nome, email, cpf, telefone, data_nascimento, cidade, estado FROM usuarios", fetch_all=True)
        cursor.execute("SELECT current_database();")
        current_db = cursor.fetchone()[0]
        print(f"Current database: {current_db}")  # Log the current database name
        users_list = [
            {
                "id": user[0],
                "nome": user[1],
                "email": user[2],
                "cpf": user[3],
                "telefone": user[4],
                "data_nascimento": user[5],
                "cidade": user[6],
                "estado": user[7]
            }
            for user in users
        ]
        return success_response("Users fetched successfully", {"users": users_list})
    except Exception as e:
        return error_response("Error fetching users", e)

@app.route('/api/admin/users', methods=['GET'])
def get_admin_users():
    try:
        users = execute_query("SELECT id, nome, email, tipo_usuario FROM usuarios WHERE tipo_usuario = 'administrador'", fetch_all=True)
        users_list = [
            {
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "role": user[3]
            }
            for user in users
        ]
        return success_response("Admin users fetched successfully", {"users": users_list})
    except Exception as e:
        return error_response("Error fetching admin users", e)

if __name__ == '__main__':
    app.run(debug=True, port=5000)