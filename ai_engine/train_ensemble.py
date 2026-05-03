import pandas as pd
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder
import numpy as np

# Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "model")

if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

print("Loading dataset...")
df = pd.read_csv(DATA_PATH)
df.fillna("None", inplace=True)

# Combine symptoms
df["all_symptoms"] = df.iloc[:, 1:].apply(
    lambda x: " ".join(x), axis=1
)

X = df["all_symptoms"]
y = df["Disease"]

print("Encoding labels and vectorizing text...")
# Convert text to vectors using TF-IDF for higher confidence and accuracy
vectorizer = TfidfVectorizer(ngram_range=(1, 2))
X_vec = vectorizer.fit_transform(X)

# Encode Labels for XGBoost
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X_vec, y_encoded, test_size=0.2, random_state=42
)

print("Training Ensemble Model (Random Forest + XGBoost + Naive Bayes)...")
# Initialize individual models
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
xgb_model = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', random_state=42)
nb_model = MultinomialNB()

# Initialize Ensemble Model (Soft Voting for probability)
ensemble_model = VotingClassifier(
    estimators=[
        ('rf', rf_model),
        ('xgb', xgb_model),
        ('nb', nb_model)
    ],
    voting='soft'
)

# Train the model
ensemble_model.fit(X_train, y_train)

# Evaluate
accuracy = ensemble_model.score(X_test, y_test)
print("[SUCCESS] Ensemble Model trained successfully")
print("[INFO] Accuracy:", round(accuracy * 100, 2), "%")

# Save model, vectorizer, and label encoder
print("Saving models...")
joblib.dump(ensemble_model, os.path.join(MODEL_DIR, "ensemble_model.pkl"))
joblib.dump(vectorizer, os.path.join(MODEL_DIR, "vectorizer.pkl"))
joblib.dump(label_encoder, os.path.join(MODEL_DIR, "label_encoder.pkl"))
print("Done!")
