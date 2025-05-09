import requests

def upload_image():
    url = "http://127.0.0.1:5000/api/events/upload"
    file_path = "c:/Users/bibs/Documents/entrance/test_image.jpg"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        data = {'event_id': '1'}
        response = requests.post(url, files=files, data=data)

    if response.status_code == 200:
        print("Upload realizado com sucesso:", response.json())
    else:
        print("Erro no upload:", response.status_code, response.text)

if __name__ == "__main__":
    upload_image()
