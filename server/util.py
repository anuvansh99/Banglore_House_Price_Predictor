import pickle
import json
import numpy as np
import os

__locations = None
__data_columns = None
__model = None

def get_estimated_price(location, sqft, bhk, bath):
    try:
        loc_index = __data_columns.index(location)
    except ValueError:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(float(__model.predict([x])[0]), 2)

def load_saved_artifacts():
    print("loading saved artifacts...start")
    global __data_columns
    global __locations
    global __model

    columns_path = os.path.join("artifacts", "columns.json")
    model_path = os.path.join("artifacts", "banglore_home_prices_model.pickle")

    # Load columns.json
    try:
        with open(columns_path, "r") as f:
            data = json.load(f)
            __data_columns = data.get('data_columns', [])
            if not __data_columns:
                print(f"Warning: 'data_columns' is empty in {columns_path}")
            else:
                print(f"Data columns loaded: {__data_columns[:5]}... (total {len(__data_columns)})")
            __locations = __data_columns[3:] if len(__data_columns) > 3 else []
            print(f"Locations loaded: {__locations[:5]}... (total {len(__locations)})")
    except Exception as e:
        print(f"Error loading columns.json: {e}")
        __data_columns = []
        __locations = []

    # Load model
    try:
        if __model is None:
            with open(model_path, 'rb') as f:
                __model = pickle.load(f)
            print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model pickle file: {e}")
        __model = None

    print("loading saved artifacts...done")

def get_location_names():
    if __locations is None:
        print("Warning: Locations not loaded, calling load_saved_artifacts()")
        load_saved_artifacts()
    return __locations

def get_data_columns():
    if __data_columns is None:
        print("Warning: Data columns not loaded, calling load_saved_artifacts()")
        load_saved_artifacts()
    return __data_columns

if __name__ == '__main__':
    load_saved_artifacts()
    print("Locations:", get_location_names())
    print("Estimate 1:", get_estimated_price('1st Phase JP Nagar', 1000, 3, 3))
    print("Estimate 2:", get_estimated_price('1st Phase JP Nagar', 1000, 2, 2))
    print("Estimate 3:", get_estimated_price('Kalhalli', 1000, 2, 2))  # other location
    print("Estimate 4:", get_estimated_price('Ejipura', 1000, 2, 2))   # other location
