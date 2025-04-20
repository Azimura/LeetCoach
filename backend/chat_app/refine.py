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


def refine_code(input_code, refine_model="refined", compliance_model="compliance") -> str:
    try:
        refine_response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": refine_model,
                "prompt": input_code,
                "stream": False
            }
        )
        refined_output = refine_response.json().get("response", "").strip()
        return refined_output

        # # Step 2: build compliance prompt using input and output
        # compliance_prompt = {
        #     "input_code": input_code,
        #     "output_code": refined_output
        # }
        #
        # # Step 3: call the compliance-checker model
        # compliance_response = requests.post(
        #     "http://localhost:11434/api/generate",
        #     json={
        #         "model": compliance_model,
        #         "prompt": str(compliance_prompt),
        #         "stream": False
        #     }
        # )
        # final_output = compliance_response.json().get("response", "").strip()
        # print(final_output)
        # return final_output
    except Exception as e:
        return f"Error calling llm model: {str(e)}"
