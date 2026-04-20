from flask import Blueprint, request, jsonify
import traceback
from services.hybrid_service import process_hybrid

hybrid_bp = Blueprint("hybrid", __name__)

@hybrid_bp.route("/predict/hybrid", methods=["POST"])
def hybrid_prediction():
    try:

        sensor_data = {
            "temperature": float(request.form.get("temperature")),
            "pressure": float(request.form.get("pressure")),
            "vibration": float(request.form.get("vibration")),
            "load": float(request.form.get("load")),
            "humidity": float(request.form.get("humidity"))
        }

        image_file = request.files.get("image")

        result = process_hybrid(sensor_data, image_file)

        return jsonify(result)

    except Exception as e:
        print("\n==== HYBRID ERROR ====")
        traceback.print_exc()
        print("======================\n")

        return jsonify({
            "error": str(e)
        }), 500