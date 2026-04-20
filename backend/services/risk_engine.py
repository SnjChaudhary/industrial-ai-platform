# services/risk_engine.py

def calculate_final_risk(sensor_risk, image_risk, sensor_weight=0.6, image_weight=0.4):
    """
    Weighted fusion of sensor and image model outputs.
    Returns Single Risk Index (SRI).
    """
    final_risk = (sensor_risk * sensor_weight) + (image_risk * image_weight)
    return round(final_risk, 3)


def classify_severity(final_risk):
    """
    Converts numerical risk into business severity level.
    """
    if final_risk >= 0.8:
        return "HIGH"
    elif final_risk >= 0.5:
        return "MEDIUM"
    return "LOW"