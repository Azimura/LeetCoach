from flask import Blueprint, request, jsonify
import ast
from models.models import db, Refine, Problem

refine_bp = Blueprint('refine', __name__)

@refine_bp.route('/chat/refine', methods=['POST'])  # POST /refine
def refine():
    data = request.get_json()
    user_id = data.get("user_id")
    problem_id = data.get("problem_id")
    input_code = data.get("input_code", "").strip()

    if not all([user_id, problem_id, input_code]):
        return jsonify({
            "message": "Missing user_id, problem_id, or input_code.",
            "result": 0
        })
    problem = Problem.query.filter_by(out_id=problem_id).first()
    if not problem:
        return jsonify({
            "message": "Problem not found",
            "result": 0
            }), 404

    try:
        ast.parse(input_code)
        answer = input_code
        result_flag = 1
    except SyntaxError:
        answer = "Input not recognized as valid code or pseudocode, or lacks necessary context. Please provide structured code or pseudocode for conversion or fixing."
        result_flag = 0

    new_refine = Refine(
        user_id=user_id,
        problem_id=problem_id,
        input_code=input_code,
        answer=answer,
        result=result_flag,
    )

    db.session.add(new_refine)
    db.session.commit()

    return jsonify({
        "message": answer,
        "result": result_flag
    })