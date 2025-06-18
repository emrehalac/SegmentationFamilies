from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# Model ve label encoder yükle
try:
    with open("model.pkl", "rb") as f:
        model, le = pickle.load(f)
except Exception as e:
    print(f"Model yüklenirken hata oluştu: {e}")
    exit(1)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    try:
        # Girdi verilerini al ve kontrol et
        gender_str = data.get("gender", "").lower()
        if gender_str not in ["male", "female"]:
            return jsonify({"error": "Cinsiyet 'male' veya 'female' olmalı."}), 400
        gender = 1 if gender_str == "male" else 0

        age = data.get("age", None)
        family_size = data.get("familySize", None)
        spending_str = data.get("spendingScore", "").lower()

        if age is None or family_size is None or spending_str == "":
            return jsonify({"error": "Yaş, Aile Büyüklüğü ve Harcama Skoru zorunlu."}), 400

        try:
            age = float(age)
            family_size = float(family_size)
        except ValueError:
            return jsonify({"error": "Yaş ve Aile Büyüklüğü sayısal olmalı."}), 400

        spending_map = {"low": 0, "average": 1, "high": 2}
        if spending_str not in spending_map:
            return jsonify({"error": "Harcama Skoru 'low', 'average' veya 'high' olmalı."}), 400
        spending = spending_map[spending_str]

        input_array = np.array([[gender, age, family_size, spending]])

        # Tahmin yap
        prediction = model.predict(input_array)

        if prediction is None or len(prediction) == 0:
            return jsonify({"error": "Model tahmini boş."}), 500

        label = le.inverse_transform(prediction)
        if label is None or pd.isna(label[0]):
            return jsonify({"error": "Geçersiz tahmin sonucu."}), 500

        return jsonify({"prediction": label[0]})

    except Exception as e:
        return jsonify({"error": f"Beklenmeyen hata: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
