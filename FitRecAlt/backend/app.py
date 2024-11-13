from flask import Flask, request, jsonify
from flask_cors import CORS
from model.predict import predict_step_per_min  # Correct import path

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Get JSON data from the request
    age = int(data.get('age'))  # Extract age
    gender = data.get('gender')  # Extract gender
    bmi = float(data.get('bmi'))  # Extract bmi
    
    # Perform model prediction using the imported function
    prediction = float(predict_step_per_min(age, gender, bmi))
    print('prediction:', prediction)
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)