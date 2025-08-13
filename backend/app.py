from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)
model = joblib.load("fuel_efficiency_model.pkl")
# Root route 
@app.route("/")
def home():
    return "Fuel Efficiency Predictor API is running!"

# Predict Route
@app.route("/predict", methods = ["POST"])
def predict():
    data = request.get_json()
    features = [[
        float(data["cylinders"]),
        float(data["displacement"]),
        float(data["horsepower"]),
        float(data["weight"]),
        float(data["acceleration"]),
        float(data["model_year"]),
        float(data["origin"])
    ]]
    result = model.predict(features)
    return jsonify({"predicted_mpg": result[0]})

if __name__ == "__main__":
    app.run(debug=True)
