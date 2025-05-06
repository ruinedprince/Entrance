from flask import jsonify
import psycopg2
from db_connection import conn as global_conn
import jwt

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
        with psycopg2.connect(
            dbname=global_conn.info.dbname,
            user=global_conn.info.user,
            password=global_conn.info.password,
            host=global_conn.info.host,
            port=global_conn.info.port
        ) as local_conn:
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
    return jsonify(response), status_code