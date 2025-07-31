from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from models import User

def generate_token(user_id, username, secret_key):
    payload = {
        'user_id': str(user_id),
        'username': username,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, secret_key, algorithm='HS256')

def verify_token(token, secret_key):
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def register_user():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        fitness_goal = data.get('fitness_goal')
        workout_frequency = data.get('workout_frequency')

        if not username or not email or not password:
            return jsonify({'error': 'All fields are required'}), 400
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400

        existing_user = User.objects(__raw__={'$or': [{'username': username}, {'email': email}]}).first()
        if existing_user:
            return jsonify({'error': 'Username or email already exists'}), 409

        password_hash = generate_password_hash(password)
        user = User(
            username=username,
            email=email,
            password_hash=password_hash,
            fitness_goal=fitness_goal,
            workout_frequency=workout_frequency
        )
        user.save()
        user_id = user.id

        from flask import current_app
        token = generate_token(user_id, username, current_app.config['SECRET_KEY'])
        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': {
                'id': str(user_id),
                'username': username,
                'email': email,
                'fitness_goal': fitness_goal,
                'workout_frequency': workout_frequency
            }
        }), 201
    except Exception as e:
        return jsonify({'error': 'Registration failed'}), 500

def login_user():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        user = User.objects(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            from flask import current_app
            token = generate_token(user.id, user.username, current_app.config['SECRET_KEY'])
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': {
                    'id': str(user.id),
                    'username': user.username,
                    'email': user.email,
                    'fitness_goal': user.fitness_goal,
                    'workout_frequency': user.workout_frequency
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500

def verify_user_token():
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
        request.current_user = payload
        return f(*args, **kwargs)
    return decorated_function
