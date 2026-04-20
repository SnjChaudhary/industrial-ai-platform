import sqlite3

DB_NAME = "maintenance.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # ===========================
    # SENSOR HISTORY TABLE
    # ===========================
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            temperature REAL,
            pressure REAL,
            vibration REAL,
            load REAL,
            humidity REAL,
            failure_probability REAL
        )
    """)

    # ===========================
    # IMAGE PREDICTIONS TABLE
    # ===========================
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS image_predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            confidence REAL,
            defect INTEGER
        )
    """)

    conn.commit()
    conn.close()