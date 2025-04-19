from datetime import datetime

from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, index=True)

class Problem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    out_id = db.Column(db.Integer, index=True, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(10), nullable=False)
    code_template = db.Column(db.Text, nullable=False)

    problem_tags = db.relationship('ProblemTag', backref='problem', lazy=True)

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, index=True)

    problem_tags = db.relationship('ProblemTag', backref='tag', lazy=True)

class ProblemTag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id'), nullable=False)

class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'), nullable=False)
    code = db.Column(db.Text, nullable=False)
    result = db.Column(db.Integer, nullable=False)
    submission_type = db.Column(db.String(10), nullable=False)  # test/submit
    test_passed = db.Column(db.Integer, nullable=False)
    test_total = db.Column(db.Integer, nullable=False)
    submission_time = db.Column(db.DateTime, default=db.func.now(), nullable=False)

    user = db.relationship('User', backref=db.backref('submissions', lazy=True))
    problem = db.relationship('Problem', backref=db.backref('submissions', lazy=True))

class UserProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'), nullable=False)
    start_time = db.Column(db.DateTime, default=db.func.now(), nullable=False)

    user = db.relationship('User', backref=db.backref('progress', lazy=True))
    problem = db.relationship('Problem', backref=db.backref('progress', lazy=True))

class TestCase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'), nullable=False)
    input_data = db.Column(db.Text, nullable=False)
    expected_output = db.Column(db.Text, nullable=False)
    is_sample = db.Column(db.Boolean, default=False)

    problem = db.relationship('Problem', backref=db.backref('test_cases', lazy=True))

class Refine(db.Model):
    __bind_key__ = 'ai_db'
    __tablename__ = 'refine'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    problem_id = db.Column(db.Integer, nullable=False)

    input_code = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    result = db.Column(db.Integer, nullable=False)

    refine_time = db.Column(db.DateTime, default=db.func.now(), nullable=False)
    __table_args__ = (
        db.Index('ix_user_problem', 'user_id', 'problem_id'),
    )