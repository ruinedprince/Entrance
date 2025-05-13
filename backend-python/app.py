from flask import Flask, send_from_directory
import os
from event_routes import event_routes
from db_connection import get_db_connection

app = Flask(__name__)

# Serve static files from the 'uploads' directory
@app.route('/uploads/<path:filename>')
def serve_static_uploads(filename):
    uploads_dir = os.path.join(os.getcwd(), 'uploads')
    return send_from_directory(uploads_dir, filename)

app.register_blueprint(event_routes, url_prefix='', name='event_routes')