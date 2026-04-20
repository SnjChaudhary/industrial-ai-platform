from flask import Flask, Response, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import os

import cv2
import numpy as np
import tensorflow as tf

from routes.dashboard import dashboard_bp
from routes.maintenance import maintenance_bp
from routes.quality import quality_bp
from routes.monitoring import monitoring_bp
from routes.hybrid import hybrid_bp

from database import init_db

import random
import time
from threading import Thread
import pandas as pd

from auth.routes import auth_routes
from middleware.auth_middleware import token_required

app = Flask(__name__)

CORS(app)

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "cnn_model.keras")

model = tf.keras.models.load_model(MODEL_PATH, compile=False)

print("Model loaded successfully")
print("Model layers:", [layer.name for layer in model.layers])

camera = cv2.VideoCapture(0)

init_db()

app.register_blueprint(auth_routes, url_prefix="/api/auth")

app.register_blueprint(dashboard_bp, url_prefix="/api")
app.register_blueprint(maintenance_bp, url_prefix="/api")
app.register_blueprint(quality_bp, url_prefix="/api")
app.register_blueprint(monitoring_bp, url_prefix="/api")
app.register_blueprint(hybrid_bp, url_prefix="/api")

@app.route("/api/reports", methods=["GET"])
@token_required(["admin"])
def get_reports(user):
    return jsonify({
        "message": "Welcome Admin",
        "user": user
    })

@app.route("/api/maintenance-secure", methods=["GET"])
@token_required(["admin", "engineer"])
def maintenance_secure(user):
    return jsonify({
        "message": "Maintenance Access",
        "user": user
    })

@app.route("/api/dashboard-secure", methods=["GET"])
@token_required(["admin", "engineer", "operator"])
def dashboard_secure(user):
    return jsonify({
        "message": "Dashboard Access",
        "user": user
    })

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

@app.route("/api/report")
@token_required(["admin"])
def get_report(user):

    start = request.args.get("start")
    end = request.args.get("end")

    data = []

    for i in range(10):
        data.append({
            "timestamp": f"2026-03-{10+i}",
            "final_risk": round(random.uniform(20, 90), 2)
        })

    return jsonify(data)

@app.route("/api/export-csv")
@token_required(["admin"])
def export_csv(user):

    start = request.args.get("start")
    end = request.args.get("end")

    rows = []

    for i in range(10):
        rows.append({
            "date": f"2026-03-{10+i}",
            "risk_level": round(random.uniform(20, 90), 2),
            "temperature": round(random.uniform(65, 85), 2),
            "vibration": round(random.uniform(1.5, 4.0), 2)
        })

    df = pd.DataFrame(rows)

    return Response(
        df.to_csv(index=False),
        mimetype="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=report.csv"
        }
    )

def sensor_stream():
    print("Sensor Stream Started")

    while True:

        temperature = random.uniform(65, 85)
        vibration = random.uniform(1.5, 4.0)
        risk = random.uniform(10, 90)

        socketio.emit("sensor_update", {

            "active_machines": 24,
            "high_risk_units": 3 if risk > 70 else 1,
            "defects_today": random.randint(5, 20),
            "downtime_saved": random.randint(10, 25),

            "risk_level": round(risk, 2),

            "db_status": True,
            "sensor_status": True,
            "warnings": 1 if risk > 60 else 0,

            "avg_temperature": round(temperature, 2),
            "avg_vibration": round(vibration, 2),

            "system_load": random.randint(50, 90),
            "efficiency_score": random.randint(85, 98),

            "temperature": round(temperature, 2),
            "vibration": round(vibration, 2),

            "timestamp": time.strftime("%H:%M:%S")
        })

        time.sleep(2)

def generate_frames():

    while True:

        success, frame = camera.read()

        if not success:
            break

        img = cv2.resize(frame, (224, 224))
        img = img / 255.0
        img = np.expand_dims(img, 0)

        prediction = float(model.predict(img)[0][0])

        label = "DEFECT" if prediction > 0.5 else "NORMAL"

        color = (0,255,0) if label == "NORMAL" else (0,0,255)

        cv2.putText(
            frame,
            f"{label} {prediction:.2f}",
            (20,40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            color,
            2
        )

        ret, buffer = cv2.imencode('.jpg', frame)

        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
@token_required(["admin", "engineer"])
def video_feed(user):
    return Response(
        generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@app.route("/")
def home():
    return {
        "status": "running",
        "service": "Industrial AI Platform",
        "version": "3.0 Clean Architecture"
    }

if __name__ == "__main__":

    if not app.debug or os.environ.get("WERKZEUG_RUN_MAIN") == "true":

        thread = Thread(target=sensor_stream)
        thread.daemon = True
        thread.start()

    socketio.run(app, host="0.0.0.0", port=5000, debug=True)