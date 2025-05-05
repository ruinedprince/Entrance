from user_routes import app
from auth_routes import auth_routes
from ticket_routes import ticket_routes
from event_routes import event_routes
from flask_cors import CORS

# Habilitar CORS globalmente
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Registrando blueprints
app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(ticket_routes, url_prefix='/tickets')
app.register_blueprint(event_routes, url_prefix='/api/admin')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)