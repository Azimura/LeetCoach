import textwrap

from flask import Blueprint, jsonify, request

from main_app.util import execute_test_case
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
        return jsonify({
            "error_message": {
                "error": "Missing user id, problem id, or user code",
                "result": 0,
            }}), 400

    problem = Problem.query.filter_by(out_id=problem_id).first()
    if not problem:
        return jsonify({
            "error_message": {
                "error": "Problem not found",
                "result": 0,
            }}), 404

    test_cases = TestCase.query.filter_by(problem_id=problem.id).all()
    total_tests = len(test_cases)
    passed_tests = 0
    last_result = {
        "result": 1
    }
    for i in range(len(test_cases)):
        tc = test_cases[i]
        result = execute_test_case(
            code=textwrap.dedent(user_code),
            input_data=tc.input_data,
            assert_code=tc.expected_output,
            timeout=3
        )
        if result['result'] == 1:
            passed_tests += 1
        else:
            last_result = result
            break

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
        "error_message": last_result,
        "test_cases": total_tests,
        "pass": passed_tests
    }

    return jsonify(res)

@problem_bp.route('/problem/test', methods=['POST'])
def test_solution():
    data = request.get_json()
    user_id = data.get("user_id")
    problem_id = data.get("problem_id")  # external id
    user_code = data.get("code")  # submitted Python function

    if not all([user_id, problem_id, user_code]):
        err_msg = {
            "error_message": {
                "error": "Missing user id, problem id, or user code",
                "result": 0,
            }}
        return jsonify(err_msg), 400

    problem = Problem.query.filter_by(out_id=problem_id).first()
    if not problem:
        return jsonify({
            "error_message": {
                "error": "Problem not found",
                "result": 0,
            }}), 404

    test_cases = TestCase.query.filter_by(problem_id=problem.id, is_sample=True).all()
    total_tests = len(test_cases)
    passed_tests = 0
    last_result = {
        "result": 1
    }
    for i in range(len(test_cases)):
        tc = test_cases[i]
        result = execute_test_case(
            code=textwrap.dedent(user_code),
            input_data=tc.input_data,
            assert_code=tc.expected_output,
            timeout=3
        )
        if result['result']:
            passed_tests += 1
        else:
            last_result = result
            break

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
        "error_message": last_result,
        "test_cases": total_tests,
        "pass": passed_tests
    }

    return jsonify(res)