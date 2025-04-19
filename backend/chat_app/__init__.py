from flask import Flask
from models import init_db
from config import Config
from chat_app.refine import refine_bp
# from chat_app.chat import chat_bp

chat_app = Flask(__name__)
chat_app.config.from_object(Config)

init_db(chat_app)

chat_app.register_blueprint(refine_bp)
# chat_app.register_blueprint(chat_bp)
