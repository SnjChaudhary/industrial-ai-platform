from flask import Blueprint, jsonify, Response
from services.monitoring_service import get_live_sensor_data
from services.alert_service import log_alert
import cv2

monitoring_bp = Blueprint("monitoring", __name__)

# ==========================
# SENSOR LIVE DATA
# ==========================
@monitoring_bp.route("/live-sensor-data", methods=["GET"])
def live_data():

    data = get_live_sensor_data()

    risk = data["risk_level"]

    # Log alert if critical
    if risk > 80:
        log_alert(risk)

    return jsonify(data)


# ==========================
# LIVE CAMERA STREAM
# ==========================
camera = cv2.VideoCapture(0)

def generate_frames():

    while True:

        success, frame = camera.read()

        if not success:
            break

        else:

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@monitoring_bp.route("/video_feed")
def video_feed():

    return Response(
        generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )