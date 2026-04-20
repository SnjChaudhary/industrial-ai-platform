import bcrypt
import jwt
import datetime

# 🔐 Secret Key
SECRET_KEY = "supersecretkey"

# ✅ Pre-hashed passwords (STATIC)
users = {
    "admin@test.com": {
        "password": bcrypt.hashpw("admin123".encode(), bcrypt.gensalt()),
        "role": "admin"
    },
    "engineer@test.com": {
        "password": bcrypt.hashpw("eng123".encode(), bcrypt.gensalt()),
        "role": "engineer"
    },
    "operator@test.com": {
        "password": bcrypt.hashpw("op123".encode(), bcrypt.gensalt()),
        "role": "operator"
    }
}

# 🔑 Generate JWT Token
def generate_token(email, role):
    payload = {
        "email": email,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# ✅ ADD THIS (MISSING)
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode(), hashed_password)