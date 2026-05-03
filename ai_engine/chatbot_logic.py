import os
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(BASE_DIR, "model", "disease_model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "model", "vectorizer.pkl"))

print("🤖 TrustCare AI Chatbot")
print("Type 'exit' anytime to stop\n")

symptoms_collected = []

while True:
    if not symptoms_collected:
        user_input = input("🧑 Tell me your symptoms: ").lower()
    else:
        user_input = input("🧑 Any other symptoms? (or type 'no'): ").lower()

    if user_input == "exit":
        print("👋 Take care! TrustCare AI signing off.")
        break

    if user_input == "no":
        symptom_text = " ".join(symptoms_collected)
        X = vectorizer.transform([symptom_text])
        prediction = model.predict(X)
        print("\n🩺 Based on your symptoms, possible disease is:", prediction[0])
        print("⚠️ Please consult a doctor for confirmation.\n")
        symptoms_collected = []
        continue

    symptoms_collected.extend(user_input.split())
