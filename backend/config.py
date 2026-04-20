import os

class Config:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    MODEL_DIR = os.path.join(BASE_DIR, "models")
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    ALERT_FILE = os.path.join(BASE_DIR, "alerts.json")

    DEBUG = True