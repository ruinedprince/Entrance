import psycopg2

# Database connection
conn = psycopg2.connect(
    dbname="entrance",
    user="postgres",
    password="123.del.123",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()