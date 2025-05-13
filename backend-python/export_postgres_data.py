import psycopg2

def export_to_csv():
    try:
        # Conexão com o banco de dados PostgreSQL
        conn = psycopg2.connect(
            host="localhost",
            database="postgres_db",
            user="postgres_user",
            password="postgres_password",
            options="-c client_encoding=LATIN1"
        )
        cursor = conn.cursor()

        # Caminho para salvar o arquivo CSV
        output_file = "usuarios_export.csv"

        # Comando COPY para exportar os dados
        with open(output_file, "w", encoding="utf-8", errors="replace") as f:
            cursor.copy_expert(
                "COPY usuarios (nome, sobrenome, email, senha, cpf, telefone, data_nascimento, endereco, cep, cidade, estado) TO STDOUT WITH CSV HEADER",
                f
            )

        print(f"Dados exportados com sucesso para {output_file}!")

    except Exception as e:
        print(f"Erro ao exportar dados: {e}")

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    export_to_csv()
