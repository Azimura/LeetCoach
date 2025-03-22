from flask import request, jsonify, Blueprint
from models import db
from models.models import User

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/user', methods=['POST'])
def get_user():
    data = request.get_json()
    if not data or "username" not in data:
        return jsonify({"error": "Missing 'username' in request body"}), 400

    username = data["username"]
    user = User.query.filter_by(username=username).first()
    if not user:
        user = User(username=username)
        db.session.add(user)
        db.session.commit()

    return jsonify({"user_id": user.id, "username": user.username})