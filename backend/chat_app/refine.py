import requests
from flask import Blueprint, request, jsonify

from chat_app.util import REFINED_MODEL, LLM_GENERATE_URL
from models.models import db, Refine

refine_bp = Blueprint('refine', __name__)


@refine_bp.route('/chat/refine', methods=['POST'])
def refine():
    data = request.get_json()
    user_id = data.get("user_id")
    problem_id = data.get("problem_id")
    input_code = data.get("input_code", "").strip()

    if not all([user_id, problem_id, input_code]):
        return jsonify({
            "message": "Missing user_id, problem_id, or input_code.",
            "result": 0
        }), 400

    try:
        answer = refine_code(prompt=input_code, model=REFINED_MODEL)
    except Exception as e:
        return jsonify({
            "message": "Error calling LLM model. Please try again.",
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


def refine_code(prompt, model) -> str:
    try:
        response = requests.post(
            LLM_GENERATE_URL,
            json={
                "model": model,
                "prompt": prompt,
                "stream": False
            },
            stream=False
        )

        output = response.json().get("response", "").strip()
        return output
    except Exception as e:
        return f"Error calling Ollama: {str(e)}"
