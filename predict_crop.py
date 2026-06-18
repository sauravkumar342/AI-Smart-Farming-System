import pickle

# Model load karo
model = pickle.load(open("models/best_model.pkl", "rb"))

# 👇 INPUT DO (manual values)

input_data = [[85, 58, 41, 21.77046169, 80.31964408, 7.038096361, 226.6555374]]


# Prediction
result = model.predict(input_data)

print("Recommended Crop:", result[0])