import random

def get_live_sensor_data():
    return {
        "temperature": round(random.uniform(30, 90), 2),
        "pressure": round(random.uniform(1, 10), 2),
        "vibration": round(random.uniform(0.1, 5), 2),
        "load": round(random.uniform(10, 100), 2),
        "humidity": round(random.uniform(20, 80), 2),
    }