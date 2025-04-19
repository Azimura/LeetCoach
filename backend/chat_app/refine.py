import requests
from flask import Blueprint, request, jsonify
from models.models import db, Refine

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

    try:
        answer = refine_code(input_code)
    except:
        return jsonify({
            "message": "Error calling LLM model. Please try again",
            "result": 2
        })

    result_flag = 1
    if "Input not recognized" in answer:
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


def refine_code(prompt, model="refined") -> str:
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": model, "prompt": prompt, "stream": False}
        )
        data = response.json()
        return data.get("response", "").strip()
    except Exception as e:
        return f"Error calling llm model: {str(e)}"
