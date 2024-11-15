import joblib
import pandas as pd

# Load the pre-trained model
best_rf_model = joblib.load('model/step_per_min_model.pkl')

# Function to make predictions
def predict_step_per_min(age, gender, bmi):
    print('age:', age)
    print('gender', gender)
    print('bmi:', bmi)
    input_data = pd.DataFrame({'age': [age], 'gender': [gender], 'bmi': [bmi]})
    prediction = best_rf_model.predict(input_data)
    return prediction[0]

# Example usage
if __name__ == "__main__":
    # Replace these values with your input data
    age = 30
    gender = 'Male'  
    bmi = 25.0

    prediction = predict_step_per_min(age, gender, bmi)
    print(f"Predicted steps per minute: {prediction}")
