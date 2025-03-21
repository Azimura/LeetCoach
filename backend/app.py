# # app.py
# from flask import Flask
# from flask_session import Session
# from models import db
# from concurrent.futures import ThreadPoolExecutor
# from flask_admin import Admin
# from flask_admin.contrib.sqla import ModelView
# from models import Problem, Tag, Submission, User, UserProgress, TestCases  # Import all models
#
#
# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///leetcode.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SESSION_TYPE'] = 'filesystem'
# app.secret_key = 'cps499'
#
# # Thread pool for chat inference
# app.executor = ThreadPoolExecutor(max_workers=4)
#
# # Initialize extensions
# db.init_app(app)
# Session(app)
#
# # Flask-Admin Setup
# admin = Admin(app, name='Problem Management', template_mode='bootstrap3')
#
# models = [Problem, Tag, Submission, User, UserProgress, TestCases]  # List of models
#
# for model in models:
#     admin.add_view(ModelView(model, db.session))  # Register each model
#
# @app.before_first_request
# def create_tables():
#     db.create_all()
#
# if __name__ == '__main__':
#     app.run(debug=True)