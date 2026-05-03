# TrustCare AI – Intelligent Healthcare Assistant 

TrustCare AI is a full-stack, AI-powered healthcare web application that acts as your personal intelligent medical assistant. It combines machine learning (ML), natural language processing (NLP), and a sleek modern web interface to analyze symptoms, predict possible diseases, interpret medical reports via OCR, and provide personalized health guidance.

##  Features

### App Walkthrough Showcase
![TrustCare AI Features Showcase](C:\Users\Admin\.gemini\antigravity\brain\b5038230-a3e6-4f44-b4ec-306525436a9a\trustcare_features_showcase_1777780639473.webp)

-  **AI Chat Assistant**: Natural conversation powered by HuggingFace NLP models to understand symptoms and intents.
-  **Symptom Checker**: Enter your symptoms to receive an instant prediction using a highly accurate **Ensemble Machine Learning Model** (Random Forest + XGBoost + Naive Bayes).
-  **Medical Report Scanner**: Upload physical lab reports and instantly extract text and identify critical values (like Hemoglobin or Sugar) using **Tesseract OCR AI**.
-  **Health Dashboard**: A comprehensive UI to track metrics like Heart Rate, Blood Pressure, and Recent Consultations.
-  **Secure Auth**: Full authentication flow ready.
-  **Sleek UI/UX**: Built with React, TailwindCSS, and glassmorphism design principles.

##  System Architecture

This project is built using a modern 3-tier microservices architecture:

1. **Frontend**: React.js, Vite, TailwindCSS (Sidebar layout, dynamic routing)
2. **Main Backend**: Node.js, Express.js (Auth, proxying, Tesseract.js OCR integration)
3. **AI Engine**: Python, FastAPI, Scikit-Learn, XGBoost, Transformers (Handling ML and NLP inferences)

##  Setup & Installation

### 1. AI Engine (Python FastAPI)
Make sure you are in the root directory:
```bash
# Create virtual environment (already done by AI)
python -m venv .venv
# Activate environment (Windows)
.venv\Scripts\Activate.ps1
# Install dependencies
pip install -r ai_engine\requirements.txt
# Run the FastAPI server (starts on port 8000)
.venv\Scripts\uvicorn ai_engine.main:app --reload
```

### 2. Main Backend (Node.js)
Navigate to the `backend` folder:
```bash
cd backend
# Install Node dependencies
npm install
# Run the Express server (starts on port 5000)
npm run dev
```

### 3. Frontend (React/Vite)
Navigate to the `frontend` folder:
```bash
cd frontend
# Install React dependencies
npm install
# Start the Vite development server
npm run dev
```

> **Note**: For the full experience, all three servers (Python API, Node.js API, React App) must be running concurrently.

##  Machine Learning Approach (The SMART Way)
We avoided a simple rule-based system in favor of a Hybrid AI approach:
- **Symptom to Disease**: Soft-Voting Ensemble Classifier blending the robustness of Random Forests, the gradient boosting power of XGBoost, and the probabilistic baseline of Naive Bayes.
- **NLP**: Zero-shot classification using Transformer models for precise intent detection.
- **OCR**: Pure WebAssembly implementation of Tesseract (`tesseract.js`) requiring no system-level binaries.

##  Disclaimer
TrustCare AI is an educational technology demonstration. It provides preliminary information only and is **NOT** a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider with any medical questions.
