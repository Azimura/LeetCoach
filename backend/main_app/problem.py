import textwrap
import traceback

from flask import Blueprint, jsonify, request
from models import db
from models.models import Problem, TestCase, Submission

problem_bp = Blueprint('problem_bp', __name__)

@problem_bp.route('/problem/<int:problem_id>', methods=['GET'])
def get_problem(problem_id):
    problem = Problem.query.filter_by(out_id=problem_id).first()
    if not problem:
        return jsonify({"error": "Problem not found"}), 404

    return jsonify({
        "problem_id": problem.out_id,
        "title": problem.title,
        "content": problem.content,
        "difficulty": problem.difficulty,
        "code_template": problem.code_template,
        "tags": [pt.tag.name for pt in problem.problem_tags]
    })

@problem_bp.route('/problem/submit', methods=['POST'])
def submit_solution():
    data = request.get_json()
    user_id = data.get("user_id")
    problem_id = data.get("problem_id")  # external id
    user_code = data.get("code")  # submitted Python function

    if not all([user_id, problem_id, user_code]):
        return jsonify({"error": "Missing user_id, problem_out_id, or code"}), 400

    # 1. Find the problem and test cases
    problem = Problem.query.filter_by(out_id=problem_id).first()
    if not problem:
        return jsonify({"error": "Problem not found"}), 404

    test_cases = TestCase.query.filter_by(problem_id=problem.id).all()
    total_tests = len(test_cases)
    passed_tests = 0
    error_message = None
    namespace = {}

    failedTC = None
    error_line = None
    for i in range(len(test_cases)):
        tc = test_cases[i]
        try:
            exec(user_code, namespace)
            exec(tc.input_data, namespace)
            exec(tc.expected_output, namespace)
            passed_tests += 1
        except AssertionError as ae:
            failedTC = tc
            error_message = str(ae)
        except Exception as e:
            tb = traceback.extract_tb(e.__traceback__)
            last = tb[-1]
            error_line = last.lineno
            error_message = f"Runtime error: {e}"

    result_flag = 1 if passed_tests == total_tests else 0
    submission = Submission(
        user_id=user_id,
        problem_id=problem.id,
        code=user_code,
        result=result_flag
    )
    db.session.add(submission)
    db.session.commit()

    res = {
        "submission_id": submission.id,
        "error_message": {
            "error": error_message,
            "error_line": error_line,
        },
        "test_cases": total_tests,
        "pass": passed_tests
    }

    if failedTC is not None:
        res["error_message"]["input"] = failedTC.input_data

    return jsonify(res)