from flask import Blueprint, request, jsonify
from services.predictive_service import (
    predict_sensor_failure,
    generate_recommendation
)

maintenance_bp = Blueprint("maintenance", __name__)


@maintenance_bp.route("/predict/sensor", methods=["POST"])
def sensor_prediction():
    data = request.json

    result = predict_sensor_failure(data)
    risk = result["failure_probability"]

    reasons, actions = generate_recommendation(
        risk,
        float(data["temperature"]),
        float(data["vibration"]),
        float(data["load"])
    )

    return jsonify({
        "risk_level": risk,
        "reasons": reasons,
        "recommended_actions": actions
    })