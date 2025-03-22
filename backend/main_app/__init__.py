from flask import Flask
from models import init_db
from config import Config
from .problem import problem_bp
from .user import user_bp

main_app = Flask(__name__)
main_app.config.from_object(Config)
init_db(main_app)

main_app.register_blueprint(user_bp)
main_app.register_blueprint(problem_bp)
