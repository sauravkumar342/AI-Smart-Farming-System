import pandas as pd

df = pd.read_csv("data/crop_dataset.csv")

# ❌ Remove invalid values
df = df[
    (df['nitrogen'] >= 0) &
    (df['phosphorus'] >= 0) &
    (df['potassium'] >= 0) &
    (df['ph'] >= 0) & (df['ph'] <= 14) &
    (df['temperature'] > -10) & (df['temperature'] < 60) &
    (df['humidity'] >= 0) & (df['humidity'] <= 100) &
    (df['rainfall'] >= 0)
]

# 🔥 Duplicate remove
df = df.drop_duplicates()

print("Cleaned Shape:", df.shape)

# save clean dataset
df.to_csv("data/crop_dataset.csv", index=False)

# 🔥 Sirf numeric columns select karo
numeric_df = df.select_dtypes(include=['int64', 'float64'])

# IQR calculation
Q1 = numeric_df.quantile(0.25)
Q3 = numeric_df.quantile(0.75)
IQR = Q3 - Q1

# Outlier remove
df = df[~((numeric_df < (Q1 - 1.5 * IQR)) | (numeric_df > (Q3 + 1.5 * IQR))).any(axis=1)]