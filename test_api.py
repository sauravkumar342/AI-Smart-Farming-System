import requests

url = "http://127.0.0.1:5000/predict_crop"

data = {
    "temperature": 22.8056033,
    "humidity": 56.50768935,
    "rainfall": 101.5952794,
    "ph": 5.791649933,
    "nitrogen": 77,
    "phosphorus": 58,
    "potassium": 19
}

response = requests.post(url, json=data)

print(response.json())