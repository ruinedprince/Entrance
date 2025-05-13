import psycopg2
import mysql.connector
import csv

def get_postgres_connection():
    return psycopg2.connect(
        host="localhost",
        database="postgres_db",
        user="postgres_user",
        password="postgres_password",
        options="-c client_encoding=UTF8"
    )

def get_mysql_connection():
    return mysql.connector.connect(
        host="localhost",
        user="Guilherme",
        password="123.del.123",
        database="entrance"
    )

def migrate_usuarios():
    postgres_conn = get_postgres_connection()
    mysql_conn = get_mysql_connection()

    try:
        postgres_cursor = postgres_conn.cursor()
        postgres_cursor.execute("SET client_encoding TO 'LATIN1';")
        mysql_cursor = mysql_conn.cursor()

        postgres_cursor.execute("SELECT nome, sobrenome, email, senha, cpf, telefone, data_nascimento, endereco, cep, cidade, estado FROM usuarios")
        usuarios = postgres_cursor.fetchall()

        # Forçar conversão para UTF-8 ao processar os dados
        usuarios = [
            tuple(
                str(col).encode('latin1', errors='replace').decode('utf-8', errors='replace') if isinstance(col, str) else col
                for col in usuario
            )
            for usuario in usuarios
        ]

        for usuario in usuarios:
            mysql_cursor.execute(
                """
                INSERT INTO usuarios (nome, sobrenome, email, senha, cpf, telefone, data_nascimento, endereco, cep, cidade, estado)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                usuario
            )

        mysql_conn.commit()
        print("Dados da tabela 'usuarios' migrados com sucesso!")

    except Exception as e:
        print(f"Erro ao migrar dados: {e}")

    finally:
        postgres_cursor.close()
        mysql_cursor.close()
        postgres_conn.close()
        mysql_conn.close()

def export_usuarios_to_csv():
    postgres_conn = get_postgres_connection()

    try:
        postgres_cursor = postgres_conn.cursor()
        postgres_cursor.execute("SELECT nome, sobrenome, email, senha, cpf, telefone, data_nascimento, endereco, cep, cidade, estado FROM usuarios")
        usuarios = postgres_cursor.fetchall()

        with open('usuarios_export.csv', 'w', newline='', encoding='utf-8') as csvfile:
            csvwriter = csv.writer(csvfile)
            csvwriter.writerow(["nome", "sobrenome", "email", "senha", "cpf", "telefone", "data_nascimento", "endereco", "cep", "cidade", "estado"])
            csvwriter.writerows(usuarios)

        print("Dados exportados para 'usuarios_export.csv' com sucesso!")

    except Exception as e:
        print(f"Erro ao exportar dados: {e}")

    finally:
        postgres_cursor.close()
        postgres_conn.close()

if __name__ == "__main__":
    export_usuarios_to_csv()
