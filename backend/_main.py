from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import requests
import json
import threading

app = Flask(__name__)
CORS(app)

OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "phi4"

ongoing_streams = {}
stream_counter = 0
streams_lock = threading.Lock()


@app.route('/chat/message', methods=['POST'])
def initiate_chat():
    global stream_counter
    data = request.get_json()
    user_id = 1
    problem_id = 26
    query = data.get("query", "").strip()

    if not query:
        return jsonify({
            "error": "Missing 'query' in request body",
            "result": 0
        }), 400

    problem = Problem.query.filter_by(out_id=problem_id).first()
    if not problem:
        print(f"Debug Mode: Problem with out_id={problem_id} not found.")
        return jsonify({
            "error": f"Problem with ID={problem_id} not found",
            "result": 0
        }), 404

    internal_problem_id = problem.id
    problem_doc = f"{problem.title}\n\n{problem.content}"

    history = Message.query.filter_by(user_id=user_id, problem_id=internal_problem_id) \
        .order_by(Message.ctime.asc()) \
        .limit(history_limit).all()

    history_blocks = []
    for turn in history:
        history_blocks.append(f"{turn.role}: {turn.content}")

    messages_for_ollama = build_prompt([problem_doc], history_blocks, query)

    with streams_lock:
        stream_id = str(stream_counter)
        stream_counter += 1

    def generate():
        full_response = ""
        successful_stream = False
        payload = {
            "model": OLLAMA_MODEL,
            "messages": [{"role": "user", "content": user_query}],
            "stream": True
        }
        try:
            response = requests.post(OLLAMA_URL, json=payload, stream=True)
            response.raise_for_status()
            for line in response.iter_lines():
                if line:
                    try:
                        decoded_line = line.decode('utf-8')
                        json_data = json.loads(decoded_line)
                        content = json_data.get('message', {}).get('content')
                        if content:
                            full_response += content
                            yield f"data: {json.dumps({'chunk': content})}\n\n"
                    except json.JSONDecodeError:
                        print(f"Error decoding JSON: {line}")
                        continue
            successful_stream = True

        except requests.exceptions.RequestException as e:
            print(f"Error connecting to or getting response from Ollama: {e}")
            yield f"data: {json.dumps({'error': f'Error connecting to Ollama: {e}'})}\n\n"

        finally:
            yield "data: {}\n\n"
            with streams_lock:
                if stream_id in ongoing_streams:
                    del ongoing_streams[stream_id]
                    print(f"Cleaned up stream_id: {stream_id}")
                else:
                    print(f"Warning: Tried to cleanup stream_id {stream_id} but it was not found.")
            if successful_stream:
                pass
                # print("Full response received:", full_response)

    with streams_lock:
        ongoing_streams[stream_id] = generate()
    print(f"Initiated stream with ID: {stream_id}")
    return jsonify({"stream_id": stream_id})


@app.route('/chat/stream/<stream_id>')
def stream(stream_id):
    generator = None
    with streams_lock:
        generator = ongoing_streams.get(stream_id)

    if generator is None:
        print(f"Attempted to get stream_id {stream_id}, but it was not found.")
        return jsonify({"error": "Invalid or expired stream ID"}), 404

    return Response(generator, mimetype='text/event-stream')


if __name__ == '__main__':
    print("Starting Flask app. Use 'flask --app <your_file_name> run' for better dev server features.")
    app.run(host='0.0.0.0', port=4999, debug=False)
