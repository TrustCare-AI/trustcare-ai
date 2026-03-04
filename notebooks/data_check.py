import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")

print("Looking for file at:", DATA_PATH)

df = pd.read_csv(DATA_PATH)
print(df.head())
print(df.shape)
