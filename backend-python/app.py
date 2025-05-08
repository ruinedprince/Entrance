from flask import Flask
import psycopg2

app = Flask(__name__)

def get_db_connection():
    return psycopg2.connect(
        dbname="entrance",
        user="postgres",
        password="123.del.123",
        host="localhost",
        port="5432"
    )