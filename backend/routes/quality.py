from flask import Blueprint, request, jsonify
from services.image_service import predict_image_defect

quality_bp = Blueprint("quality", __name__)

@quality_bp.route("/predict/image", methods=["POST"])
def predict_image():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:

        print("File received:", file.filename)

        result = predict_image_defect(file)

        return jsonify(result)

    except Exception as e:

        print("Prediction error:", str(e))

        return jsonify({
            "error": "Prediction failed",
            "details": str(e)
        }), 500