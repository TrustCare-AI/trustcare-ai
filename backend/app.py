from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # 🔥 REQUIRED for React

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load ML components
model = joblib.load(os.path.join(BASE_DIR, "model", "disease_model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "model", "vectorizer.pkl"))

# Load extra medical info
desc_df = pd.read_csv(os.path.join(BASE_DIR, "data", "symptom_Description.csv"))
prec_df = pd.read_csv(os.path.join(BASE_DIR, "data", "symptom_precaution.csv"))

# Chat memory (temporary, per session)
chat_state = {
    "symptoms": [],
    "age": None,
    "gender": None,
    "severity": None,
    "stage": "symptoms"
}

@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json.get("message", "").lower()

    # ---- CHAT FLOW LOGIC ----
    if chat_state["stage"] == "symptoms":
        if len(user_msg.split()) < 2:
            return jsonify({
                "reply": "Please describe your symptoms clearly (e.g. fever headache nausea)."
            })

        chat_state["symptoms"].append(user_msg)
        chat_state["stage"] = "age"
        return jsonify({"reply": "May I know your age?"})

    if chat_state["stage"] == "age":
        chat_state["age"] = user_msg
        chat_state["stage"] = "gender"
        return jsonify({"reply": "Please tell your gender."})

    if chat_state["stage"] == "gender":
        chat_state["gender"] = user_msg
        chat_state["stage"] = "severity"
        return jsonify({"reply": "How severe are the symptoms? (mild / moderate / severe)"})

    if chat_state["stage"] == "severity":
        chat_state["severity"] = user_msg

        symptom_text = " ".join(chat_state["symptoms"])
        X = vectorizer.transform([symptom_text])
        disease = model.predict(X)[0]

        # Description
        description = desc_df[desc_df["Disease"] == disease]["Description"].values
        description = description[0] if len(description) else "No description available."

        # Precautions
        precautions = prec_df[prec_df["Disease"] == disease].iloc[:, 1:].values
        precaution_text = "\n".join([f"- {p}" for p in precautions[0] if p]) if len(precautions) else "No precautions found."

        # Reset chat
        chat_state.update({
            "symptoms": [],
            "age": None,
            "gender": None,
            "severity": None,
            "stage": "symptoms"
        })

        reply = f"""
🩺 Possible Disease: {disease}

📖 Description:
{description}

🛡️ Precautions:
{precaution_text}

⚠️ Please consult a doctor for medical confirmation.
"""
        return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)
