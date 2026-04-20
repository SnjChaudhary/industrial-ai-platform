import random

def get_live_sensor_data():
    return {
        "temperature": round(random.uniform(40, 90), 2),
        "pressure": round(random.uniform(2, 10), 2),
        "vibration": round(random.uniform(0, 5), 2),
        "load": round(random.uniform(20, 100), 2),
        "humidity": round(random.uniform(30, 80), 2),
        "risk_level": round(random.uniform(0, 100), 2)
    }
