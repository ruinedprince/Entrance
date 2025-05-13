import datetime
import mysql.connector

def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="Guilherme",
    password="123.del.123",  # Substitua por sua senha
        database="entrance"
    )
    return connection

def test_mysql_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="Guilherme",
            password="123.del.123",  # Substitua por sua senha
            database="entrance"
        )
        if connection.is_connected():
            print("Connection to MySQL database was successful!")
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if connection.is_connected():
            connection.close()

def list_tables():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        if tables:
            print("Tabelas no banco de dados:")
            for table in tables:
                print(table[0])
        else:
            print("Nenhuma tabela encontrada no banco de dados.")
    except mysql.connector.Error as err:
        print(f"Erro ao listar tabelas: {err}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def create_usuarios_table():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                sobrenome VARCHAR(100),
                email VARCHAR(100) UNIQUE NOT NULL,
                confirmacao_email VARCHAR(100),
                senha VARCHAR(255) NOT NULL,
                confirmacao_senha VARCHAR(255),
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                cpf VARCHAR(14),
                telefone VARCHAR(15),
                data_nascimento DATE,
                cep VARCHAR(10),
                endereco VARCHAR(255),
                cidade VARCHAR(100),
                estado VARCHAR(2),
                tipo_usuario VARCHAR(20) DEFAULT 'participante'
            );
            """
        )
        connection.commit()
        print("Tabela 'usuarios' criada com sucesso!")
    except mysql.connector.Error as err:
        print(f"Erro ao criar a tabela 'usuarios': {err}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def fetch_all_users():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM usuarios;")
        users = cursor.fetchall()
        for user in users:
            print(user)
    except mysql.connector.Error as err:
        print(f"Erro ao buscar usuários: {err}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Database connection
conn = get_db_connection()
cursor = conn.cursor()

# Função para inserir eventos no banco de dados
def insert_test_events():
    try:
        # Data inicial e final para o ano de 2025
        start_date = datetime.date(2025, 1, 1)
        end_date = datetime.date(2025, 12, 31)

        # Iterar por cada semana do ano de 2025
        current_date = start_date
        while current_date <= end_date:
            for i in range(3):  # Inserir 3 eventos por semana
                event_date = current_date + datetime.timedelta(days=i)
                slug = f"evento-teste-{event_date.strftime('%Y-%m-%d')}-{i+1}".lower().replace(' ', '-')
                cursor.execute(
                    """
                    INSERT INTO eventos (name, date, description, city, state, slug)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (
                        f"Evento Teste {event_date.strftime('%Y-%m-%d')} - {i+1}",
                        event_date,
                        "Descrição do evento de teste.",
                        "São Paulo",
                        "São Paulo",
                        slug
                    )
                )
            # Avançar para a próxima semana
            current_date += datetime.timedelta(weeks=1)

        # Salvar alterações no banco de dados
        conn.commit()
        print("Eventos de teste inseridos com sucesso!")
    except Exception as e:
        print("Erro ao inserir eventos de teste:", e)
        conn.rollback()

if __name__ == "__main__":
    test_mysql_connection()
    create_usuarios_table()
    list_tables()
    fetch_all_users()
