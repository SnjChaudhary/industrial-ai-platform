import os
import base64
import numpy as np
import tensorflow as tf
import cv2
import matplotlib.cm as cm
from PIL import Image
from config import Config
from services.gradcam import make_gradcam_heatmap

# =========================
# LOAD MODEL
# =========================

MODEL_PATH = os.path.join(Config.MODEL_DIR, "cnn_model.keras")

model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False
)

print("Model loaded successfully")
print("Model layers:", [layer.name for layer in model.layers])


# =========================
# IMAGE PREDICTION
# =========================

def predict_image_defect(file):

    file.seek(0)

    img = Image.open(file).convert("RGB")

    original_width, original_height = img.size

    # IMPORTANT: same size as training
    img_resized = img.resize((224,224))

    img_array = np.array(img_resized)
    img_batch = np.expand_dims(img_array, axis=0)

    prediction = float(model.predict(img_batch, verbose=0)[0][0])
    print("Prediction score:", prediction)

    defect = prediction > 0.3

    confidence = prediction if defect else 1 - prediction

    # =========================
    # GRADCAM
    # =========================

    heatmap = make_gradcam_heatmap(img_batch, model)

    heatmap_base64 = ""

    if heatmap is not None:

        heatmap = cv2.resize(
            heatmap,
            (original_width, original_height)
        )

        heatmap = np.uint8(255 * heatmap)

        jet = cm.get_cmap("jet")

        jet_colors = jet(np.arange(256))[:, :3]

        jet_heatmap = jet_colors[heatmap]

        jet_heatmap = np.uint8(jet_heatmap * 255)

        superimposed_img = jet_heatmap * 0.4 + np.array(img)

        superimposed_img = np.uint8(superimposed_img)

        _, buffer = cv2.imencode(".jpg", superimposed_img)

        heatmap_base64 = base64.b64encode(buffer).decode("utf-8")

    return {
        "defect": bool(defect),
        "confidence": float(confidence),
        "category": "Defective" if defect else "Normal",
        "heatmap": heatmap_base64,
        "reasoning": "Surface anomaly detected" if defect else "Surface normal"
    }


# =========================
# HYBRID SYSTEM SUPPORT
# =========================

def get_image_risk(file):

    file.seek(0)

    img = Image.open(file).convert("RGB")

    img_resized = img.resize((224,224))

    img_array = np.array(img_resized)

    img_batch = np.expand_dims(img_array, axis=0)

    prediction = float(model.predict(img_batch, verbose=0)[0][0])

    return prediction