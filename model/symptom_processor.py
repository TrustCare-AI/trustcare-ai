import pandas as pd
import os
from sklearn.feature_extraction.text import CountVectorizer

# Get base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")

# Load dataset
df = pd.read_csv(DATA_PATH)
df.fillna("None", inplace=True)

# Combine all symptom columns into one text string
df["all_symptoms"] = df.iloc[:, 1:].apply(
    lambda x: " ".join(x), axis=1
)

# Convert symptoms text to numbers
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(df["all_symptoms"])
y = df["Disease"]

print("✔ Symptoms converted to vectors")
print("✔ Total samples:", X.shape[0])
print("✔ Total unique symptoms:", len(vectorizer.get_feature_names_out()))
