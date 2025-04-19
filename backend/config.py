class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///coding.db'
    SECRET_KEY = 'cps499'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_BINDS = {
        'ai_db': 'sqlite:///ai.db'
    }