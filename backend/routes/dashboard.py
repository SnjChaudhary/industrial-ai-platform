from flask import Blueprint, jsonify
from services.alert_service import get_alerts

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard-summary", methods=["GET"])
def dashboard_summary():
    return jsonify({
        "machines_active": 24,
        "high_risk_machines": 3,
        "defects_today": 12,
        "downtime_saved_hours": 18
    })


@dashboard_bp.route("/alerts", methods=["GET"])
def alerts():
    return jsonify(get_alerts())