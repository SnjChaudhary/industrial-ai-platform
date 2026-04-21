from flask import Flask, Response, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import os

# ❌ REMOVED HEAVY IMPORTS (TensorFlow, OpenCV)
# import cv2
# import tensorflow as tf

import numpy as np
import random
import time
from threading import Thread
import pandas as pd

from routes.dashboard import dashboard_bp
from routes.maintenance import maintenance_bp
from routes.quality import quality_bp
from routes.monitoring import monitoring_bp
from routes.hybrid import hybrid_bp

from database import init_db

from auth.routes import auth_routes
from middleware.auth_middleware import token_required

app = Flask(__name__)
CORS(app)

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)

# ✅ DB INIT
init_db()

# ✅ ROUTES
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(dashboard_bp, url_prefix="/api")
app.register_blueprint(maintenance_bp, url_prefix="/api")
app.register_blueprint(quality_bp, url_prefix="/api")
app.register_blueprint(monitoring_bp, url_prefix="/api")
app.register_blueprint(hybrid_bp, url_prefix="/api")

# ===========================
# 🔐 AUTH ROUTES
# ===========================

@app.route("/api/reports", methods=["GET"])
@token_required(["admin"])
def get_reports(user):
    return jsonify({"message": "Welcome Admin", "user": user})

@app.route("/api/maintenance-secure", methods=["GET"])
@token_required(["admin", "engineer"])
def maintenance_secure(user):
    return jsonify({"message": "Maintenance Access", "user": user})

@app.route("/api/dashboard-secure", methods=["GET"])
@token_required(["admin", "engineer", "operator"])
def dashboard_secure(user):
    return jsonify({"message": "Dashboard Access", "user": user})

# ===========================
# 📊 DASHBOARD DATA
# ===========================

@app.route("/api/dashboard/live", methods=["GET"])
@token_required(["admin", "engineer", "operator"])
def get_live_dashboard(user):
    return {
        "active_machines": 24,
        "high_risk_units": 3,
        "defects_today": 12,
        "downtime_saved": 18,
        "risk_level": 35,
        "db_status": True,
        "sensor_status": True,
        "warnings": 1,
        "avg_temperature": 74,
        "avg_vibration": 2.4,
        "system_load": 68,
        "efficiency_score": 91
    }

# ===========================
# 📄 REPORT API
# ===========================

@app.route("/api/report")
@token_required(["admin"])
def get_report(user):
    data = [
        {
            "timestamp": f"2026-03-{10+i}",
            "final_risk": round(random.uniform(20, 90), 2)
        }
        for i in range(10)
    ]
    return jsonify(data)

# ===========================
# 📥 CSV EXPORT
# ===========================

@app.route("/api/export-csv")
@token_required(["admin"])
def export_csv(user):
    rows = [
        {
            "date": f"2026-03-{10+i}",
            "risk_level": round(random.uniform(20, 90), 2),
            "temperature": round(random.uniform(65, 85), 2),
            "vibration": round(random.uniform(1.5, 4.0), 2)
        }
        for i in range(10)
    ]

    df = pd.DataFrame(rows)

    return Response(
        df.to_csv(index=False),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=report.csv"}
    )

# ===========================
# 🔴 REAL-TIME SENSOR (SAFE)
# ===========================

def sensor_stream():
    print("Sensor Stream Started")

    while True:
        temperature = random.uniform(65, 85)
        vibration = random.uniform(1.5, 4.0)
        risk = random.uniform(10, 90)

        socketio.emit("sensor_update", {
            "risk_level": round(risk, 2),
            "avg_temperature": round(temperature, 2),
            "avg_vibration": round(vibration, 2),
            "timestamp": time.strftime("%H:%M:%S")
        })

        time.sleep(2)

# ===========================
# 🏠 HOME
# ===========================

@app.route("/")
def home():
    return {
        "status": "running",
        "service": "Industrial AI Platform",
        "version": "cloud-safe"
    }

# ===========================
# 🚀 MAIN (DEPLOY SAFE)
# ===========================

if __name__ == "__main__":

    thread = Thread(target=sensor_stream)
    thread.daemon = True
    thread.start()

    port = int(os.environ.get("PORT", 5000))

    socketio.run(
        app,
        host="0.0.0.0",
        port=port
    )