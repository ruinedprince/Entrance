from flask import jsonify
from db_connection import conn, cursor

def execute_query(query, params=None, fetch_one=False, fetch_all=False):
    try:
        cursor.execute(query, params or ())
        if fetch_one:
            return cursor.fetchone()
        if fetch_all:
            return cursor.fetchall()
        conn.commit()
    except Exception as e:
        conn.rollback()
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