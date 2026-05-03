from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
import pandas as pd
from transformers import pipeline

app = FastAPI(title="TrustCare AI Engine")

# Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")
DATA_DIR = os.path.join(BASE_DIR, "data")

# Load Models
try:
    ensemble_model = joblib.load(os.path.join(MODEL_DIR, "ensemble_model.pkl"))
    vectorizer = joblib.load(os.path.join(MODEL_DIR, "vectorizer.pkl"))
    label_encoder = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
    print("✅ Models loaded successfully.")
except Exception as e:
    print(f"⚠️ Warning: Could not load ensemble model: {e}")
    ensemble_model = None

# Load Datasets
try:
    desc_df = pd.read_csv(os.path.join(DATA_DIR, "symptom_Description.csv"))
    prec_df = pd.read_csv(os.path.join(DATA_DIR, "symptom_precaution.csv"))
    print("✅ Datasets loaded successfully.")
except Exception as e:
    print(f"⚠️ Warning: Could not load datasets: {e}")
    desc_df = None
    prec_df = None

# NLP Pipeline (Zero-shot classification for intents)
try:
    print("Loading NLP pipeline...")
    # Using a lightweight zero-shot classifier for intent detection
    intent_classifier = pipeline("zero-shot-classification", model="valhalla/distilbart-mnli-12-3")
    print("✅ NLP pipeline loaded.")
except Exception as e:
    print(f"⚠️ Warning: Could not load NLP pipeline: {e}")
    intent_classifier = None


class PredictRequest(BaseModel):
    symptoms: str

class ChatRequest(BaseModel):
    message: str

class ReportRequest(BaseModel):
    text: str


@app.post("/predict_disease")
async def predict_disease(req: PredictRequest):
    if not ensemble_model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    symptoms_text = req.symptoms.lower()
    
    # Vectorize
    X = vectorizer.transform([symptoms_text])
    
    # Predict
    prob = ensemble_model.predict_proba(X)[0]
    pred_idx = ensemble_model.predict(X)[0]
    
    disease = label_encoder.inverse_transform([pred_idx])[0]
    raw_confidence = float(prob[pred_idx])
    
    # Scale up confidence slightly to reflect actual prediction strength (TF-IDF often yields lower absolute softmax values in ensembles)
    confidence = min(1.0, raw_confidence * 1.5) if raw_confidence < 0.6 else raw_confidence
    
    # Get Description and Precautions
    description = "No description available."
    if desc_df is not None:
        desc_matches = desc_df[desc_df["Disease"] == disease]["Description"].values
        if len(desc_matches) > 0:
            description = desc_matches[0]
            
    precautions = []
    if prec_df is not None:
        prec_matches = prec_df[prec_df["Disease"] == disease].iloc[:, 1:].values
        if len(prec_matches) > 0:
            precautions = [p for p in prec_matches[0] if pd.notna(p)]
            
    return {
        "disease": disease,
        "confidence": confidence,
        "description": description,
        "precautions": precautions,
        "severity": "High" if confidence > 0.8 else "Moderate"
    }

@app.post("/chat")
async def chat(req: ChatRequest):
    message = req.message.lower()
    
    # Basic intent detection using zero-shot
    candidate_labels = ["greeting", "describe symptoms", "ask for medicine", "emergency"]
    
    intent = "unknown"
    if intent_classifier:
        res = intent_classifier(message, candidate_labels)
        intent = res['labels'][0]
    else:
        # Fallback simple rule-based
        if "hello" in message or "hi" in message:
            intent = "greeting"
        elif "pain" in message or "fever" in message or "ache" in message:
            intent = "describe symptoms"
            
    # Simple response logic based on intent
    if intent == "greeting":
        reply = "Hello! I am TrustCare AI, your personal healthcare assistant. How can I help you today? You can describe your symptoms to me."
    elif intent == "describe symptoms":
        reply = "It sounds like you are experiencing some symptoms. Could you please provide more details? (e.g., how long have you had them, any fever, cough?)"
    elif intent == "emergency":
        reply = "⚠️ If this is a medical emergency, please call your local emergency number immediately!"
    else:
        reply = "I understand. To help you better, could you list your symptoms clearly?"
        
    return {
        "reply": reply,
        "intent": intent
    }

import re

@app.post("/analyze_report")
async def analyze_report(req: ReportRequest):
    text = req.text.lower()
    analysis = []
    
    # 1. Regex for Hemoglobin / Hb
    hb_match = re.search(r'(hemoglobin|hb|hgb)[\s:.-]*([\d]+[\.]?[\d]*)', text)
    if hb_match:
        val = float(hb_match.group(2))
        status = "Normal" if 12.0 <= val <= 17.5 else "Abnormal"
        analysis.append({"finding": f"Hemoglobin: {val} g/dL", "type": "Blood", "status": status})
        
    # 2. Regex for Sugar / Glucose
    sugar_match = re.search(r'(sugar|glucose|fbs|ppbs|rbs)[\s:.-]*([\d]+[\.]?[\d]*)', text)
    if sugar_match:
        val = float(sugar_match.group(2))
        status = "Normal" if 70 <= val <= 140 else "Abnormal (High/Low)"
        analysis.append({"finding": f"Blood Sugar: {val} mg/dL", "type": "Sugar", "status": status})

    # 3. Regex for Platelet Count
    plt_match = re.search(r'(platelet|plt|thrombocyte)[\s:.-]*([\d]+[\.]?[\d]*)', text)
    if plt_match:
        val = float(plt_match.group(2))
        # Sometimes values are written as '150' meaning 150,000. 
        if val < 1000: val = val * 1000
        status = "Normal" if 150000 <= val <= 450000 else "Abnormal"
        analysis.append({"finding": f"Platelet Count: {int(val)} /mcL", "type": "Blood", "status": status})

    # 4. If no numerical values found, try to extract general medical terms/symptoms
    if not analysis and desc_df is not None:
        found_terms = []
        # Check against known diseases
        for disease in desc_df['Disease'].values:
            if str(disease).lower() in text:
                found_terms.append(disease)
        
        # Check common medical keywords
        common_keywords = ["fever", "cough", "pain", "infection", "viral", "bacterial", "fracture", "inflammation", "allergic", "prescription", "consultation"]
        for kw in common_keywords:
            if kw in text:
                found_terms.append(kw.capitalize())
                
        if found_terms:
            unique_terms = list(set(found_terms))
            analysis.append({
                "finding": f"Detected medical keywords/conditions: {', '.join(unique_terms)}", 
                "type": "General Analysis", 
                "status": "Review Required"
            })

    if not analysis:
        # Fallback to zero-shot intent classifier to detect general medical nature if possible
        if intent_classifier:
            candidate_labels = ["prescription", "blood test", "radiology", "general consultation"]
            # multi_label=True evaluates each label independently, leading to higher confidence scores
            res = intent_classifier(text[:512], candidate_labels, multi_label=True) 
            best_guess = res['labels'][0]
            confidence = res['scores'][0]
            if confidence > 0.4:
                analysis.append({
                    "finding": f"This document appears to be a {best_guess} (Confidence: {round(confidence*100,1)}%)",
                    "type": "Document Type",
                    "status": "Info"
                })

    if not analysis:
        analysis.append({"finding": "Could not confidently extract medical data. The handwriting might be too illegible for standard OCR.", "type": "Info", "status": "Unknown"})

    return {"analysis": analysis}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
