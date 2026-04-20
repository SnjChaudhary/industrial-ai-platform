import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
rows = 2000

data = pd.DataFrame({
    "temperature": np.random.uniform(40, 100, rows),
    "pressure": np.random.uniform(1, 12, rows),
    "vibration": np.random.uniform(0, 6, rows),
    "load": np.random.uniform(10, 120, rows),
    "humidity": np.random.uniform(20, 90, rows)
})

data["maintenance_needed"] = (
    (data["temperature"] > 85) |
    (data["vibration"] > 4.5) |
    (data["pressure"] > 10)
).astype(int)

X = data[["temperature", "pressure", "vibration", "load", "humidity"]]
y = data["maintenance_needed"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)

model = RandomForestClassifier()
model.fit(X_train, y_train)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(model, os.path.join(MODEL_DIR, "predictive_model.pkl"))
joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))

print("✅ Sensor model trained and saved successfully!")