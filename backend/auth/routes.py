from flask import Blueprint, request, jsonify
from .utils import users, generate_token, verify_password

auth_routes = Blueprint("auth_routes", __name__)

@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = users.get(email)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not verify_password(password, user["password"]):
        return jsonify({"error": "Invalid password"}), 401

    token = generate_token(email, user["role"])

    return jsonify({
        "token": token,
        "role": user["role"]
    })