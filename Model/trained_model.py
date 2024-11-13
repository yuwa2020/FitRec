import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import joblib  # For saving and loading models

# Load the dataset
data = pd.read_csv('./demo.csv')

# Separate features and target
X = data[['age', 'gender', 'bmi']]
y = data['step_per_min']

# Define the preprocessing and model pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['age', 'bmi']),
        ('cat', OneHotEncoder(handle_unknown='ignore'), ['gender'])
    ]
)

best_rf_model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=200, max_depth=None, min_samples_split=5, random_state=42))
])

# Fit the model on the entire dataset
best_rf_model.fit(X, y)

# Save the model to a file
joblib.dump(best_rf_model, 'step_per_min_model.pkl')
print("Model saved successfully!")
