import sqlite3

def clear_events_table():
    db_path = "c:/Users/bibs/Documents/entrance/backend-python/database.db"
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM eventos;")
        conn.commit()
        print("Tabela 'eventos' limpa com sucesso.")
    except Exception as e:
        print(f"Erro ao limpar a tabela 'eventos': {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    clear_events_table()
