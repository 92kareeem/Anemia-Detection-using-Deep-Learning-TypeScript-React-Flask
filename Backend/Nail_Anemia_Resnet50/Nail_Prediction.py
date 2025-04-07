import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing.image import load_img, img_to_array
# Prediction function
def predict_anemia(image_path, model_path='Nail_Anemia_Resnet50/nail_model_ResNet.keras'):
    model = tf.keras.models.load_model(model_path)
    img = load_img(image_path, target_size=(224, 224))
    img = img_to_array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    prediction = model.predict(img)[0][0]
    return "Anemia Detected" if prediction > 0.5 else "No Anemia"

# Example usage
if __name__ == "__main__":
    test_image_path = "Backend/Nail_Anemia_Resnet50/anemic.png"
    result = predict_anemia(test_image_path)
    print(result)
