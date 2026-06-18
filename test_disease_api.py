import requests

# API URL
url = "http://127.0.0.1:5000/predict_disease"

# Image file bhejna
files = {
    'file': open("data/disease_images/Rust/0015_0028.jpg", "rb")
}

# Request bhejna
response = requests.post(url, files=files)

# Output print
print(response.json())