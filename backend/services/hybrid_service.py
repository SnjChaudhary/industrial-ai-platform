from services.risk_engine import calculate_final_risk, classify_severity
from services.predictive_service import get_sensor_risk
from services.image_service import get_image_risk


def process_hybrid(sensor_data, image_file):

    print("Sensor Data:", sensor_data)

    sensor_risk = get_sensor_risk(sensor_data)
    print("Sensor Risk:", sensor_risk)

    image_risk = get_image_risk(image_file)
    print("Image Risk:", image_risk)

    final_risk = calculate_final_risk(sensor_risk, image_risk)

    severity = classify_severity(final_risk)

    return {
        "sensor_risk": float(sensor_risk),
        "image_risk": float(image_risk),
        "final_risk": float(final_risk),
        "severity": severity
    }