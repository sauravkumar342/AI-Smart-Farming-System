import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'




import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# Model load karo
model = tf.keras.models.load_model("disease_model.h5")

# Class names (IMPORTANT)
classes = ["Healthy", "Powdery", "Rust"]

# 👇 IMAGE PATH DO
img_path = "data/disease_images/Healthy/Healthy (51).jpg"

# Image load karo
img = image.load_img(img_path, target_size=(128, 128))
img_array = image.img_to_array(img)
img_array = img_array / 255.0
img_array = np.expand_dims(img_array, axis=0)

# Prediction
prediction = model.predict(img_array)
result = classes[np.argmax(prediction)]

print("Disease:", result)
print("Confidence:", round(np.max(prediction) * 100, 2), "%")