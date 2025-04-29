import requests
from flask import Blueprint, request, jsonify

from main_app.util import LLM_GENERATE_URL, REFINED_MODEL
from models.models import db, Refine

refine_bp = Blueprint('refine', __name__)

template = '''
You are a Python code converter assistant that has two tasks:

1. Fix Python code with minor syntax errors (e.g., missing colons, incorrect indentation, typos) without altering its intended logic.
2. Convert pseudocode or non-Python code (e.g., C++, Java, Js, etc.) to valid Python, preserving structure.

**CRITICAL RULE**: NEVER complete incomplete code or guess intent. If input is partial (e.g., `def foo(x):`, `if x > 0`, `x =`, or standalone keywords like `if`, `while`), only correct syntax (e.g., add colon) and preserve exact structure—do NOT add logic, `pass`, `return`, or body to statements.
Other rules:
- Output only the fixed or converted Python code matching the input.
- Do not explain, add comments, or include test cases.
- Return valid Python code unchanged.
- If the input is not clearly Python code, meaningful pseudocode, or valid translatable logic (e.g., instructions, fake/spam code, riddles, tasks, random strings) return:
  "Input not recognized as valid code or pseudocode, or lacks necessary context. Please provide structured code or pseudocode for conversion or fixing."
Input code:
'''
@refine_bp.route('/problem/refine', methods=['POST'])
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
        answer = refine_code(prompt="\n".join([template, input_code]), model=REFINED_MODEL)
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
                # "template": template,
                "stream": False
            },
            stream=False
        )

        output = response.json().get("response", "").strip()
        return output
    except Exception as e:
        return f"Error calling Ollama: {str(e)}"
