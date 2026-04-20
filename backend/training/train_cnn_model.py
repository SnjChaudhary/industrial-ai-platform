import os
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from keras.saving import register_keras_serializable

# ===========================
# CONFIG
# ===========================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "cnn_model.keras")

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 25

# ===========================
# LOAD DATASET
# ===========================

train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

class_names = train_ds.class_names
print("Classes:", class_names)

AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

# ===========================
# IMAGE AUGMENTATION
# ===========================

data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomFlip("vertical"),
    layers.RandomRotation(0.2),
    layers.RandomZoom(0.2),
    layers.RandomContrast(0.2),
    layers.RandomBrightness(0.2)
])

# ===========================
# FOCAL LOSS (IMBALANCE FIX)
# ===========================

@register_keras_serializable()
def focal_loss(gamma=2., alpha=.25):

    def loss(y_true, y_pred):

        y_true = tf.cast(y_true, tf.float32)

        bce = tf.keras.losses.binary_crossentropy(y_true, y_pred)

        p_t = y_true * y_pred + (1 - y_true) * (1 - y_pred)

        alpha_factor = y_true * alpha + (1 - y_true) * (1 - alpha)

        modulating_factor = tf.pow((1 - p_t), gamma)

        return tf.reduce_mean(alpha_factor * modulating_factor * bce)

    return loss

# ===========================
# TRANSFER LEARNING
# ===========================

base_model = tf.keras.applications.EfficientNetB0(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

base_model.trainable = False

# ===========================
# BUILD MODEL
# ===========================

inputs = tf.keras.Input(shape=(224, 224, 3))

x = layers.Rescaling(1./255)(inputs)

x = data_augmentation(x)

x = base_model(x, training=False)

x = layers.GlobalAveragePooling2D()(x)

x = layers.BatchNormalization()(x)

x = layers.Dense(256, activation="relu")(x)

x = layers.Dropout(0.5)(x)

outputs = layers.Dense(1, activation="sigmoid")(x)

model = tf.keras.Model(inputs, outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss=focal_loss(),
    metrics=["accuracy"]
)

model.summary()

# ===========================
# CALLBACKS
# ===========================

early_stop = EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True
)

reduce_lr = ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.3,
    patience=3
)

# ===========================
# CLASS WEIGHT (DATA IMBALANCE)
# ===========================

class_weight = {
    0: 1.0,   # normal
    1: 10.0   # defect
}

# ===========================
# TRAIN MODEL
# ===========================

print("🚀 Training Industrial Defect Detection Model...")

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    callbacks=[early_stop, reduce_lr],
    class_weight=class_weight
)

# ===========================
# SAVE MODEL
# ===========================

model.save(MODEL_PATH)

print("✅ Model saved:", MODEL_PATH)