from app import app
from auth_routes import auth_routes
from ticket_routes import ticket_routes
from event_routes import event_routes
from flask_cors import CORS

# Habilitar CORS globalmente
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"], "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}}, supports_credentials=True)

app.config['UPLOAD_FOLDER'] = 'uploads/'

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

# Registrando blueprints
app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(ticket_routes, url_prefix='/tickets')
app.register_blueprint(event_routes, url_prefix='/api/admin')

# Listar todas as rotas registradas no servidor
with app.test_request_context():
    print("Rotas registradas no servidor:")
    for rule in app.url_map.iter_rules():
        print(rule)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)