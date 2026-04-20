from flask import Blueprint, jsonify
import random

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/reports")
def reports():

    trends = [
        {"time":"10:00","risk":30},
        {"time":"11:00","risk":45},
        {"time":"12:00","risk":60},
        {"time":"13:00","risk":40},
        {"time":"14:00","risk":70}
    ]

    defects = [
        {"name":"Scratch","value":10},
        {"name":"Crack","value":5},
        {"name":"Dent","value":7}
    ]

    return jsonify({
        "trends": trends,
        "defects": defects
    })