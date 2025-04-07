import numpy as np
import os
import pandas as pd
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing.image import load_img, img_to_array, ImageDataGenerator
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D, BatchNormalization
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
from tqdm import tqdm

# Load dataset paths
anemia_path = 'Nail_Anemia_Resnet50/Fingernails/Anemic'
non_anemia_path = 'Nail_Anemia_Resnet50/Fingernails/Non Anemic'

# Function to load image paths
def load_image_paths(folder_path, label):
    return [(os.path.join(folder_path, filename), label) for filename in os.listdir(folder_path)]

anemia_data = load_image_paths(anemia_path, 1)
non_anemia_data = load_image_paths(non_anemia_path, 0)

# Create DataFrame
df = pd.DataFrame(anemia_data + non_anemia_data, columns=['Image', 'Label'])

# Handle Class Imbalance
anemia_count = df[df['Label'] == 1].shape[0]
non_anemia_count = df[df['Label'] == 0].shape[0]
class_weight = {0: anemia_count / non_anemia_count, 1: 1.0}  # Balance classes

# Split dataset
x_train, x_test, y_train, y_test = train_test_split(df['Image'], df['Label'], test_size=0.2, random_state=42)

# Function to preprocess images
def preprocess_images(image_paths):
    images = []
    for image_path in tqdm(image_paths):
        img = load_img(image_path, target_size=(224, 224))
        img = img_to_array(img) / 255.0
        images.append(img)
    return np.array(images)

# Preprocess images
x_train_images = preprocess_images(x_train)
x_test_images = preprocess_images(x_test)
y_train = np.array(y_train)
y_test = np.array(y_test)

# Data Augmentation
datagen = ImageDataGenerator(
    rotation_range=10, width_shift_range=0.1, height_shift_range=0.1,
    shear_range=0.1, zoom_range=0.1, horizontal_flip=True, fill_mode="nearest"
)

# Load ResNet50 model
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Unfreeze last 30 layers for fine-tuning
for layer in base_model.layers[:-30]:
    layer.trainable = False
for layer in base_model.layers[-30:]:
    layer.trainable = True

# Custom layers
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(512, activation='relu')(x)
x = BatchNormalization()(x)
x = Dropout(0.4)(x)
x = Dense(256, activation='relu')(x)
x = Dropout(0.3)(x)
output = Dense(1, activation='sigmoid')(x)

# Create and compile model
model = Model(inputs=base_model.input, outputs=output)
model.compile(optimizer=Adam(learning_rate=1e-5), loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(datagen.flow(x_train_images, y_train, batch_size=32),
          epochs=20, validation_data=(x_test_images, y_test),
          class_weight=class_weight)

# Save model
model.save('nail_model_ResNet.keras')



