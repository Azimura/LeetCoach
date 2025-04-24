import json
import threading

import redis
import requests
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

from chat_app.refine import refine_bp
from chat_app.util import build_prompt, CHAT_MODEL, LLM_CHAT_URL
from models import init_db, db
from config import Config
from models.models import Problem, Message

chat_app = Flask(__name__)
chat_app.config.from_object(Config)

init_db(chat_app)
CORS(chat_app)

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)
ongoing_streams = {}
stream_counter = 0
streams_lock = threading.Lock()

chat_app.register_blueprint(refine_bp)


@chat_app.route('/chat/message', methods=['POST'])
def initiate_chat(history_limit=10):
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

    messages = build_prompt([problem_doc], history_blocks, query)

    with streams_lock:
        stream_id = str(stream_counter)
        stream_counter += 1

    def generate():
        full_response = ""
        successful_stream = False
        payload = {
            "model": CHAT_MODEL,
            "messages": messages,
            "stream": True
        }
        try:
            response = requests.post(LLM_CHAT_URL, json=payload, stream=True)
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

            if successful_stream:
                with chat_app.app_context():
                    try:
                        db.session.add_all([
                            Message(user_id=user_id, problem_id=internal_problem_id, role="user", content=query),
                            Message(user_id=user_id, problem_id=internal_problem_id, role="assistant",
                                    content=full_response),
                        ])
                        db.session.commit()
                        print(f"Saved conversation.")
                    except Exception as save_error:
                        db.session.rollback()
                        print(f"Error saving conversation: {save_error}")

    with streams_lock:
        ongoing_streams[stream_id] = generate()
    print(f"Initiated stream with ID: {stream_id}")
    return jsonify({"stream_id": stream_id})


@chat_app.route('/chat/stream/<stream_id>')
def stream(stream_id):
    generator = None
    with streams_lock:
        generator = ongoing_streams.get(stream_id)

    if generator is None:
        print(f"Attempted to get stream_id {stream_id}, but it was not found.")
        return jsonify({"error": "Invalid or expired stream ID"}), 404

    return Response(generator, mimetype='text/event-stream')

@chat_app.route('/')
def index():
    return 'WELCOME!'