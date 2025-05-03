from flask import Flask, request, jsonify
from flask_cors import CORS
from auth_routes import auth_routes
from ticket_routes import ticket_routes
from event_routes import event_routes  # Importando o módulo de rotas de eventos
from utils import execute_query, success_response, error_response
from db_connection import cursor

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_routes)
app.register_blueprint(ticket_routes)
app.register_blueprint(event_routes)  # Registrando as rotas de eventos

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)