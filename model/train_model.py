import pandas as pd
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")

# Load dataset
df = pd.read_csv(DATA_PATH)
df.fillna("None", inplace=True)

# Combine symptoms
df["all_symptoms"] = df.iloc[:, 1:].apply(
    lambda x: " ".join(x), axis=1
)

X = df["all_symptoms"]
y = df["Disease"]

# Convert text to vectors
vectorizer = CountVectorizer()
X_vec = vectorizer.fit_transform(X)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X_vec, y, test_size=0.2, random_state=42
)

# Train model
model = MultinomialNB()
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print("✅ Model trained successfully")
print("🎯 Accuracy:", round(accuracy * 100, 2), "%")

# Save model & vectorizer
joblib.dump(model, os.path.join(BASE_DIR, "model", "disease_model.pkl"))
joblib.dump(vectorizer, os.path.join(BASE_DIR, "model", "vectorizer.pkl"))
