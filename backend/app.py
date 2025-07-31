import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
from config import Config
from database import init_db
from auth import register_user, login_user, verify_user_token, require_auth

load_dotenv() 
try:
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY not found in .env file")
        
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    model = None

app = Flask(__name__)

# Configure the app
app.config.from_object(Config)

# Initialize database
init_db(app)

CORS(app)


def generate_prompt(objective, frequency):
    """Creates a detailed, structured prompt for the Gemini API."""
    return f"""
You are a world-class fitness and nutrition expert. Your task is to create a detailed, weekly workout plan for a user based on their specific goals.

The user's goals are:
- Primary Objective: "{objective}"
- Workout Frequency: "{frequency} days per week"

Please generate a structured workout plan in a valid JSON format. Do not include any text, explanations, or markdown formatting like ```json outside of the JSON object itself. The JSON object should have a root key "weeklyPlan". For each workout day, provide a "day" (e.g., "Day 1"), a "focus" (e.g., "Upper Body Strength"), and a list of "exercises". Each exercise in the list should be an object with the following keys: "name", "type" (e.g., 'strength', 'cardio'), "sets", and "reps" or "duration_seconds".

Example exercise object: {{ "name": "Bench Press", "type": "strength", "sets": 4, "reps": "8-10" }}
"""

def clean_json_response(text):
    """Removes markdown formatting from the model's JSON response."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

# --- API ROUTES ---
@app.route('/')
def hello():
    return jsonify({'message': 'Welcome to IntelliFit API'})

@app.route('/api/workouts/generate-plan', methods=['POST'])
def generate_workout_plan():
    if not model:
        return jsonify({'error': 'AI Model not loaded or configured properly'}), 500
    
    data = request.get_json()
    if not data or 'objective' not in data or 'frequency' not in data:
        return jsonify({'error': 'Invalid input: "objective" and "frequency" are required.'}), 400  
    
    objective = data['objective']
    frequency = data['frequency']

    try:
        prompt = generate_prompt(objective, frequency)
        response = model.generate_content(prompt)
        cleaned_text = clean_json_response(response.text)
        workout_plan = json.loads(cleaned_text)
        
        return jsonify(workout_plan)

    except json.JSONDecodeError:
        print("---RAW RESPONSE THAT FAILED JSON PARSING---")
        print(response.text)
        print("-------------------------------------------")
        return jsonify({'error': 'Failed to parse the AI model response as JSON.'}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({'error': f'An error occurred while generating the plan: {str(e)}'}), 500

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
