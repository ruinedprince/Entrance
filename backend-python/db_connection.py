import psycopg2
import datetime

# Database connection
conn = psycopg2.connect(
    dbname="entrance",
    user="postgres",
    password="123.del.123",
    host="localhost",
    port="5432"
)
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
                cursor.execute(
                    """
                    INSERT INTO eventos (name, date, description, city, state)
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    (
                        f"Evento Teste {event_date.strftime('%Y-%m-%d')} - {i+1}",
                        event_date,
                        "Descrição do evento de teste.",
                        "São Paulo",
                        "São Paulo"
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
