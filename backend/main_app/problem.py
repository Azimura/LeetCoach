from flask import Blueprint, jsonify
from models.models import Problem

problem_bp = Blueprint('problem_bp', __name__)

@problem_bp.route('/problem/<int:problem_id>', methods=['GET'])
def get_problem(problem_id):
    problem = Problem.query.filter_by(out_id=problem_id).first()
    if not problem:
        return jsonify({"error": "Problem not found"}), 404

    print()

    return jsonify({
        "problem_id": problem.out_id,
        "title": problem.title,
        "content": problem.content,
        "difficulty": problem.difficulty,
        "code_template": problem.code_template,
        "tags": [pt.tag.name for pt in problem.problem_tags]
    })