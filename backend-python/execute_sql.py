import sys
from db_connection import get_db_connection

def execute_sql_script():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        with open('backend-python/database_setup.sql', 'r', encoding='utf-8') as sql_file:
            sql_commands = sql_file.read().split(';')
            for command in sql_commands:
                command = command.strip()
                if command:
                    cursor.execute(command)
            conn.commit()
        print('Tabelas criadas com sucesso!')
    except Exception as e:
        print(f'Erro ao executar o script SQL: {e}')
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == '__main__':
    execute_sql_script()
