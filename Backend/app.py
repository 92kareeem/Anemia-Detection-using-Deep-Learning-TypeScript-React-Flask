from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import numpy as np
from PIL import Image, ImageFile
import io
import os
import logging
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Allow truncated images to load
ImageFile.LOAD_TRUNCATED_IMAGES = True

app = Flask(__name__)

# Enhanced CORS configuration
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

@app.after_request
def after_request(response):
    #response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    #response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    #response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    #response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Model paths (adjust these according to your directory structure)
MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)))
EYE_MODEL_PATH = os.path.join(MODELS_DIR, 'Eye_Anemia_Resnet50', 'eye_model_ResNet.keras')
NAIL_MODEL_PATH = os.path.join(MODELS_DIR, 'Nail_Anemia_Resnet50', 'nail_model_ResNet.keras')

# Load models at startup
EYE_MODEL = None
NAIL_MODEL = None

try:
    EYE_MODEL = tf.keras.models.load_model(EYE_MODEL_PATH)
    logger.info("✅ Eye model loaded successfully")
except Exception as e:
    logger.error(f"❌ Error loading eye model: {str(e)}")

try:
    NAIL_MODEL = tf.keras.models.load_model(NAIL_MODEL_PATH)
    logger.info("✅ Nail model loaded successfully")
except Exception as e:
    logger.error(f"❌ Error loading nail model: {str(e)}")

def preprocess_image(image, target_size=(224, 224)):
    """Preprocess image for model prediction"""
    try:
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize and normalize
        image = image.resize(target_size)
        img_array = img_to_array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        logger.error(f"Image preprocessing failed: {str(e)}")
        raise ValueError(f"Image processing error: {str(e)}")

def make_prediction(model, image):
    """Make prediction using the specified model"""
    try:
        prediction = model.predict(image)[0][0]
        return prediction
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise ValueError(f"Prediction error: {str(e)}")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'running',
        'models_loaded': {
            'eye_model': EYE_MODEL is not None,
            'nail_model': NAIL_MODEL is not None
        }
    })

@app.route('/api/predict/eye', methods=['POST'])
def predict_eye():
    """Predict anemia from eye image"""
    if 'file' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No file uploaded',
            'code': 'NO_FILE'
        }), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No selected file',
            'code': 'NO_FILE_SELECTED'
        }), 400
    
    try:
        # Load and preprocess image
        image = Image.open(io.BytesIO(file.read()))
        img_array = preprocess_image(image)
        
        if EYE_MODEL is None:
            return jsonify({
                'success': False,
                'error': 'Eye model not loaded',
                'code': 'MODEL_NOT_LOADED'
            }), 500
        
        # Make prediction
        prediction = make_prediction(EYE_MODEL, img_array)
        result = 'Anemia Detected' if prediction > 0.5 else 'No Anemia'
        confidence = float(prediction) if result == 'Anemia Detected' else float(1 - prediction)
        
        return jsonify({
            'success': True,
            'prediction': result,
            'confidence': round(confidence * 100, 2),
            'type': 'eye'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'code': 'PREDICTION_ERROR'
        }), 500

@app.route('/api/predict/nail', methods=['POST'])
def predict_nail():
    """Predict anemia from nail image"""
    if 'file' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No file uploaded',
            'code': 'NO_FILE'
        }), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No selected file',
            'code': 'NO_FILE_SELECTED'
        }), 400
    
    try:
        # Load and preprocess image
        image = Image.open(io.BytesIO(file.read()))
        img_array = preprocess_image(image)
        
        if NAIL_MODEL is None:
            return jsonify({
                'success': False,
                'error': 'Nail model not loaded',
                'code': 'MODEL_NOT_LOADED'
            }), 500
        
        # Make prediction
        prediction = make_prediction(NAIL_MODEL, img_array)
        result = 'Anemia Detected' if prediction > 0.5 else 'No Anemia'
        confidence = float(prediction) if result == 'Anemia Detected' else float(1 - prediction)
        
        return jsonify({
            'success': True,
            'prediction': result,
            'confidence': round(confidence * 100, 2),
            'type': 'nail'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'code': 'PREDICTION_ERROR'
        }), 500

if __name__ == '__main__':
    # Print configuration details
    logger.info(f"Eye model path: {EYE_MODEL_PATH}")
    logger.info(f"Nail model path: {NAIL_MODEL_PATH}")
    logger.info("Starting Flask server...")
    
    app.run(host='0.0.0.0', port=5000, debug=True)