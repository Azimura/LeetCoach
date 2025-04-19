from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
        db.engines['ai_db'].connect()
        db.create_all(bind_key='ai_db')