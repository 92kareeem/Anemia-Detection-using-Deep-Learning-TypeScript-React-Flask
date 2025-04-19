  
# Anemia Detection using Deep Learning (ResNet50 + React + Flask) 
    
*A non-invasive anemia detection system using conjunctiva and nail bed analysis*   
     
# 🔍 Overview   
This project provides a web-based solution for detecting anemia through eye and nail images using: 
- **Deep Learning**: ResNet50 models for image classification
- **Frontend**: TypeScript, React.js, with modern UI/UX
- **Backend**: Flask CORS API serving predictions 
      
# 📸 Screenshots
# Landing Page

![image](https://github.com/user-attachments/assets/71b036db-da71-43d5-b0c3-60911d6691d3)

# Detection & Diet Recommendation
![image](https://github.com/user-attachments/assets/cf6f40ad-6a87-4ff3-a67f-1e6b502e7a0a)

# Personalized Diet Plan
![image](https://github.com/user-attachments/assets/227d8505-e416-4cde-a95c-7cbe8b3e45af)

# Information Hub
![image](https://github.com/user-attachments/assets/53a42719-fecd-438f-ba50-a5bfefdbfcb7)

# FAQ Section
![image](https://github.com/user-attachments/assets/9e5caa5a-8016-419d-99ea-a4d7415cd6a9)




## 🛠 Tech Stack
| Component | Technology |
|-----------|------------|
| **Frontend** | React, TypeScript, TailwindCSS, Vite |
| **Backend** | Flask, Python 3.10+ |
| **AI Models** | TensorFlow/Keras (ResNet50 architecture) |
| **Build Tools** | npm, pip, git |


## 🚀 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 16+
- Git

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Set environment variables
export EYE_MODEL_PATH="./path_to/eye_model_ResNet.keras"
export NAIL_MODEL_PATH="./path_to/nail_model_ResNet.keras"

# Run server
python app.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Model Setup (Optional)
1. Download datasets from [Google Drive](https://drive.google.com/drive/folders/1jzdkYn_TSO4QhsssRl6w9fOkJahYpni2)
2. Run generators:
```bash
python backend/generators/Eye_ResNet50_Generator.py
python backend/generators/Nail_ResNet50_Generator.py
```
*Note: Update paths in generator scripts before running*

## 🌟 Key Features
- **Dual-Model Analysis**: Combines eye conjunctiva and nail bed assessment
- **Responsive UI**: Mobile-friendly interface
- **Confidence Scoring**: Provides prediction confidence percentages
- **Developer Friendly**: Well-documented code with type hints

## 🧪 Testing the System
1. Access frontend at `http://localhost:5173`
2. Upload eye/nail images through the interface
3. View real-time predictions

## ⚠️ Important Notes
- Run frontend and backend in separate terminals
- Model paths must be correctly configured
- For production, use environment variables for sensitive data

## 🤝 Contribution
Contributions welcome! Please:
1. Fork the repository
2. Create your feature branch
3. Submit a pull request

## 📧 Contact
For support or questions:
- Email: syedabdulkareemahmed@gmail.com
- GitHub: [@92kareeem](https://github.com/92kareeem)

## 📜 License
MIT License - See [LICENSE](LICENSE) for details
