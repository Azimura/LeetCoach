import csv
from flask import Flask

from config import Config
from models import init_db
from models.models import db, User, Problem, Tag, ProblemTag, Submission, UserProgress, TestCase, Refine, Message
from sqlalchemy.orm import class_mapper

app = Flask(__name__)
app.config.from_object(Config)
init_db(app)

def dump_table_to_csv(model, filename):
    columns = [column.key for column in class_mapper(model).columns]

    # Check if model has 'user_id' column
    if 'user_id' in columns:
        rows = model.query.filter(model.user_id > 4).all()
    else:
        rows = model.query.all()

    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(columns)
        for row in rows:
            # print([getattr(row, col) for col in columns])
            writer.writerow([getattr(row, col) for col in columns])

with app.app_context():
    dump_table_to_csv(User, 'User.csv')
    dump_table_to_csv(Submission, 'Submission.csv')
    dump_table_to_csv(UserProgress, 'UserProgress.csv')
    dump_table_to_csv(Refine, 'Refine.csv')
    # dump_table_to_csv(Message, 'Message.csv')
