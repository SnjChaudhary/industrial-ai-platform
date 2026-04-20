import os
import joblib
import numpy as np
import pandas as pd

MODEL_PATH = os.path.join("models", "predictive_model.pkl")
SCALER_PATH = os.path.join("models", "scaler.pkl")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)


def predict_sensor_failure(data):

    features = pd.DataFrame([{
        "temperature": data["temperature"],
        "pressure": data["pressure"],
        "vibration": data["vibration"],
        "load": data["load"],
        "humidity": data["humidity"]
    }])

    features_scaled = scaler.transform(features)

    probability = model.predict_proba(features_scaled)[0][1]

    return {
        "failure_probability": float(probability)
    }

# 🧠 Decision Recommendation Engine
def generate_recommendation(risk, temperature, vibration, load):
    reasons = []
    actions = []

    if vibration > 4.5:
        reasons.append("High vibration detected")
        actions.append("Inspect bearing system")

    if temperature > 85:
        reasons.append("Temperature above safe threshold")
        actions.append("Check cooling system")

    if load > 100:
        reasons.append("Machine overload condition")
        actions.append("Reduce operational load by 15%")

    if risk > 0.8:
        actions.append("Schedule maintenance within 24 hours")

    return reasons, actions


# ✅ NEW FUNCTION FOR HYBRID SYSTEM
def get_sensor_risk(sensor_data):
    result = predict_sensor_failure(sensor_data)
    return result["failure_probability"]