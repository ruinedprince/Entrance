import requests

# URL do endpoint de upload
url = "http://localhost:5000/api/events/upload"

# Caminho para a imagem de teste
image_path = "c:/Users/bibs/Documents/entrance/test_image.jpg"

# Dados do formulário
data = {
    "event_id": "28"  # Substitua pelo ID do evento registrado
}

# Arquivo para upload
files = {
    "file": open(image_path, "rb")
}

# Enviar a requisição POST
response = requests.post(url, data=data, files=files)

# Exibir a resposta
print("Status Code:", response.status_code)
print("Response:", response.json())