from flask import Flask
from flask_cors import CORS
from config import Config
from database import init_db

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
mongo = init_db(app)

@app.route('/')
def hello():
    return {'message': 'Welcome to IntelliFit API'}

if __name__ == '__main__':
    app.run(debug=True)
