import pandas as pd

df = pd.read_csv("data/crop_dataset.csv")

print("Shape:", df.shape)
print("\nColumns:", df.columns)

print("\nSample Data:")
print(df.head())

print("\nLabel Distribution:")
print(df['label'].value_counts())

print("\nCheck Null Values:")
print(df.isnull().sum())