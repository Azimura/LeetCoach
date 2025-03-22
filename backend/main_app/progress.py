from flask import Blueprint, request, jsonify
from models import db
from models.models import User, Problem, UserProgress

progress_bp = Blueprint('progress_bp', __name__)

@progress_bp.route('/progress', methods=['POST'])
def create_progress():
    data = request.get_json()
    user_id = data.get("user_id")
    problem_id = data.get("problem_id")

    if not user_id or not problem_id:
        return jsonify({"error": "Missing user_id or problem_id"}), 400

    user = User.query.get(user_id)
    problem = Problem.query.filter_by(out_id=problem_id).first()

    if not user or not problem:
        return jsonify({"error": "Invalid user_id or problem_id"}), 400

    progress = UserProgress.query.filter_by(user_id=user_id, problem_id=problem_id).first()
    if not progress:
        progress = UserProgress(user_id=user_id, problem_id=problem_id)
        db.session.add(progress)
        db.session.commit()

    return jsonify({
        "message": "Progress created",
        "start_time": int(progress.start_time.timestamp())
    })