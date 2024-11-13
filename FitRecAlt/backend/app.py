# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
# from your_model_module import YourModelClass  # Import your model class

app = Flask(__name__)
CORS(app)
# model = YourModelClass()  # Initialize your model

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Get JSON data from the request
    feature1 = data.get('feature1')  # Extract feature1
    feature2 = data.get('feature2')  # Extract feature2
    
    # Perform model prediction
    # prediction = model.predict([[feature1, feature2]])  # Assuming the model expects a 2D array
    prediction = int(feature1) * int(feature2)
    return jsonify(prediction)  # Send the prediction result as JSON

if __name__ == '__main__':
    app.run(debug=True)