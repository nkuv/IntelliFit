from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from database import mongo
from bson.objectid import ObjectId

def generate_token(user_id, username, secret_key):
    """Generate JWT token for user authentication"""
    payload = {
        'user_id': str(user_id),
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, secret_key, algorithm='HS256')

def verify_token(token, secret_key):
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def register_user():
    """Handle user registration"""
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({'error': 'All fields are required'}), 400

        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400

        # Check if user already exists
        existing_user = mongo.db.users.find_one({
            '$or': [{'username': username}, {'email': email}]
        })
        
        if existing_user:
            return jsonify({'error': 'Username or email already exists'}), 409

        password_hash = generate_password_hash(password)

        # Create new user
        user_data = {
            'username': username,
            'email': email,
            'password_hash': password_hash,
            'created_at': datetime.datetime.utcnow()
        }
        
        result = mongo.db.users.insert_one(user_data)
        user_id = result.inserted_id
        
        # Generate token
        from flask import current_app
        token = generate_token(user_id, username, current_app.config['SECRET_KEY'])
        
        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': {'id': str(user_id), 'username': username, 'email': email}
        }), 201

    except Exception as e:
        return jsonify({'error': 'Registration failed'}), 500

def login_user():
    """Handle user login"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        # Find user by username
        user = mongo.db.users.find_one({'username': username})

        if user and check_password_hash(user['password_hash'], password):
            from flask import current_app
            token = generate_token(user['_id'], user['username'], current_app.config['SECRET_KEY'])
            
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': {
                    'id': str(user['_id']), 
                    'username': user['username'], 
                    'email': user['email']
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500

def verify_user_token():
    """Verify user token"""
    try:
        token = request.headers.get('Authorization')
        if token and token.startswith('Bearer '):
            token = token[7:] 
            
        from flask import current_app
        payload = verify_token(token, current_app.config['SECRET_KEY'])
        if payload:
            return jsonify({'valid': True, 'user': payload}), 200
        else:
            return jsonify({'valid': False}), 401
            
    except Exception as e:
        return jsonify({'error': 'Token verification failed'}), 500

def require_auth(f):
    """Decorator to require authentication for routes"""
    from functools import wraps
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if token and token.startswith('Bearer '):
            token = token[7:]
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
            
        from flask import current_app
        payload = verify_token(token, current_app.config['SECRET_KEY'])
        if not payload:
            return jsonify({'error': 'Token is invalid or expired'}), 401
            
        # Add user info to request context
        request.current_user = payload
        return f(*args, **kwargs)
    
    return decorated_function
