from flask import jsonify
import psycopg2
from db_connection import get_db_connection
import jwt
import logging
import mysql.connector

# Configuração básica de logging
logging.basicConfig(
    level=logging.ERROR,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("error.log"),
        logging.StreamHandler()
    ]
)

def log_error(error_message):
    logger = logging.getLogger("ApplicationError")
    logger.error(error_message)

SECRET_KEY = "your_secret_key"  # Replace with your actual secret key

def decode_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")

def execute_query(query, params=None, fetch_one=False, fetch_all=False):
    try:
        with get_db_connection() as local_conn:
            with local_conn.cursor() as cursor:
                print("Checking database connection...")
                print("Database connection is active.")  # Log after confirming connection
                print(f"Executing query: {query}")  # Log the query being executed
                print(f"With parameters: {params}")  # Log the parameters being passed
                cursor.execute(query, params or ())
                print("Query executed successfully.")  # Log after query execution
                if fetch_one:
                    return cursor.fetchone()
                if fetch_all:
                    return cursor.fetchall()
                local_conn.commit()
                print("Transaction committed successfully.")  # Log after commit
    except Exception as e:
        print(f"Error during query execution: {e}")
        log_error(f"Error during query execution: {e}")  # Log error using logging
        raise e

def success_response(message, data=None):
    response = {"message": message}
    if data:
        response.update(data)
    return jsonify(response), 200

def error_response(message, error=None, status_code=500):
    response = {"message": message}
    if error:
        response["error"] = str(error)
        log_error(f"Error response: {error}")  # Log error using logging
    return jsonify(response), status_code

# Script para testar manualmente a correspondência entre senha e hash
if __name__ == "__main__":
    from bcrypt import checkpw

    senha_fornecida = "123teste123"
    hash_armazenado = "$2b$12$wU3B6pi67OJWD0CZZWZMeuM7Uk/3Hi05SdtY8UGizX09WqTJwv.1e"

    if checkpw(senha_fornecida.encode('utf-8'), hash_armazenado.encode('utf-8')):
        print("A senha fornecida corresponde ao hash armazenado.")
    else:
        print("A senha fornecida NÃO corresponde ao hash armazenado.")