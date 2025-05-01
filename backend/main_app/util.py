import multiprocessing
import traceback

LLM_GENERATE_URL = "http://localhost:11434/api/generate"
REFINED_MODEL = "refined"

def run_user_code(user_code, input_code, assert_code, return_dict):
    namespace = {}
    try:
        exec(user_code, namespace)
        exec(input_code, namespace)
        exec(assert_code, namespace)
        return_dict['result'] = 1
    except AssertionError as ae:
        return_dict['result'] = 0
        return_dict['error'] = str(ae)
        if len(input_code) > 100:
            input_code = input_code[:200] + "..."
        return_dict['input'] = input_code
    except Exception as e:
        tb = traceback.extract_tb(e.__traceback__)
        last = tb[-1]
        return_dict['result'] = 0
        return_dict['error'] = f"Runtime error: {e}"
        return_dict['error_line'] = last.lineno

def execute_test_case(code, input_data, assert_code, timeout=2):
    manager = multiprocessing.Manager()
    return_dict = manager.dict()
    p = multiprocessing.Process(target=run_user_code, args=(code, input_data, assert_code, return_dict))
    p.start()
    p.join(timeout)

    if p.is_alive():
        p.terminate()
        return {
            "result": 0,
            "error": "Time Limit Exceeded",
        }
    return dict(return_dict)