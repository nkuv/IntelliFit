from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import init_db
from auth import register_user, login_user, verify_user_token, require_auth

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
mongo = init_db(app)

@app.route('/')
def hello():
    return {'message': 'Welcome to IntelliFit API'}

# Authentication routes
@app.route('/api/register', methods=['POST'])
def register():
    return register_user()

@app.route('/api/login', methods=['POST'])
def login():
    return login_user()

@app.route('/api/verify', methods=['POST'])
def verify():
    return verify_user_token()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'IntelliFit API is running'}), 200

# Protected route example
@app.route('/api/profile', methods=['GET'])
@require_auth
def get_profile():
    from flask import request
    user_info = request.current_user
    return jsonify({
        'message': 'Profile data', 
        'user': user_info
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)
