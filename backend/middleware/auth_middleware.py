from functools import wraps
from flask import request, jsonify
import jwt
from auth.utils import SECRET_KEY

def token_required(allowed_roles=None):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):

            token = request.headers.get("Authorization")

            if not token:
                return jsonify({"error": "Token missing"}), 403

            try:
                decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            except Exception as e:
                print("JWT Error:", str(e))  # ✅ debug
                return jsonify({"error": "Invalid token"}), 401

            if allowed_roles and decoded.get("role") not in allowed_roles:
                return jsonify({"error": "Access denied"}), 403

            return f(decoded, *args, **kwargs)

        return wrapper
    return decorator