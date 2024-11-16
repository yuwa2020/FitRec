import pandas as pd

# File paths
csv_file_path = 'intensity_data.csv'
json_file_path = 'intensity_data.json'

try:
    # Read the CSV file
    data = pd.read_csv(csv_file_path)

    # Save as JSON
    data.to_json(json_file_path, orient='records', indent=2)
    print('JSON file has been saved.')
except Exception as e:
    print(f'Error: {e}')