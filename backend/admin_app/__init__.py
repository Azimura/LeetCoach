from flask import Flask
from flask_admin import Admin
from models import init_db
from models.models import db, User, Problem, Tag, ProblemTag, Submission, UserProgress, TestCase
from config import Config
from .views import ProblemAdmin, UserAdmin, TagAdmin, ProblemTagAdmin, SubmissionAdmin, UserProgressAdmin, TestCaseAdmin

admin_app = Flask(__name__)
admin_app.config.from_object(Config)

init_db(admin_app)
admin = Admin(admin_app, name='Admin Panel', template_mode='bootstrap3')

admin.add_view(UserAdmin(User, db.session))
admin.add_view(ProblemAdmin(Problem, db.session))
admin.add_view(TagAdmin(Tag, db.session))
admin.add_view(ProblemTagAdmin(ProblemTag, db.session))
admin.add_view(SubmissionAdmin(Submission, db.session))
admin.add_view(UserProgressAdmin(UserProgress, db.session))
admin.add_view(TestCaseAdmin(TestCase, db.session))