import json
import os
from datetime import datetime

ALERT_FILE = "alerts.json"

# Ensure file exists
if not os.path.exists(ALERT_FILE):
    with open(ALERT_FILE, "w") as f:
        json.dump([], f)


def log_alert(risk):
    with open(ALERT_FILE, "r") as f:
        alerts = json.load(f)

    alerts.append({
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "risk": risk,
        "message": "Critical risk detected"
    })

    with open(ALERT_FILE, "w") as f:
        json.dump(alerts, f, indent=4)


def get_alerts():
    with open(ALERT_FILE, "r") as f:
        return json.load(f)