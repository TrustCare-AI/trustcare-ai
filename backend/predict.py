import joblib
import pandas as pd

model = joblib.load("../model/disease_model.pkl")
vectorizer = joblib.load("../model/vectorizer.pkl")

desc_df = pd.read_csv("../data/symptom_Description.csv")
prec_df = pd.read_csv("../data/symptom_precaution.csv")

def predict_disease(text):
    vect = vectorizer.transform([text])
    disease = model.predict(vect)[0]

    desc = desc_df[desc_df["Disease"] == disease]["Description"].values
    precautions = prec_df[prec_df["Disease"] == disease].iloc[:, 1:].values

    description = desc[0] if len(desc) else "No description available."

    precaution_list = precautions[0].tolist() if len(precautions) else []

    reply = f"""
🦠 Predicted Disease: {disease}

📖 Description:
{description}

🛡 Precautions:
""" + "\n".join([f"- {p}" for p in precaution_list if p])

    return reply