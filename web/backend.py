import joblib
import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load trained model
model = joblib.load('heart-preds.pkl')

# Define categorical encoding manually
sex_map = {'M': 1, 'F': 0}
chest_pain_map = {'ATA': 0, 'NAP': 1, 'ASY': 2, 'TA': 3}
resting_ecg_map = {'Normal': 0, 'ST': 1, 'LVH': 2}
exercise_angina_map = {'N': 0, 'Y': 1}
st_slope_map = {'Up': 0, 'Flat': 1, 'Down': 2} 

@app.route("/")
def home():
    return jsonify({"message": "Heart Disease Prediction API is running!"})

@app.route("/predict/<values>")
def preds(values):
    columns = ['Age', 'Sex', 'ChestPainType', 'RestingBP', 'Cholesterol', 
               'FastingBS', 'RestingECG', 'MaxHR', 'ExerciseAngina', 'Oldpeak', 'ST_Slope']

    try:
        values_list = values.split(',')
        
        if len(values_list) != len(columns):
            return jsonify({"error": "Incorrect number of inputs. Expected {} values.".format(len(columns))}), 400

        # Map categorical values to numbers
        values_list[1] = sex_map.get(values_list[1], -1)
        values_list[2] = chest_pain_map.get(values_list[2], -1)
        values_list[6] = resting_ecg_map.get(values_list[6], -1)
        values_list[8] = exercise_angina_map.get(values_list[8], -1)
        values_list[10] = st_slope_map.get(values_list[10], -1)

        if -1 in values_list:
            return jsonify({"error": "Invalid categorical input provided"}), 400

        # Convert to float
        values_list = list(map(float, values_list))

        # Create a DataFrame
        new_data = pd.DataFrame([values_list], columns=columns)

        # Make a prediction
        prediction = model.predict(new_data)[0]

        return jsonify({"prediction": "YES" if prediction == 1 else "NO"})

    except ValueError:
        return jsonify({"error": "Invalid input format. Provide correct values."}), 400

if __name__ == "__main__":
    app.run(debug=True)
