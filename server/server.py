from flask import Flask, request, jsonify, send_from_directory
import util
import os
import faulthandler
faulthandler.enable()

app = Flask(__name__, static_folder='frontend', static_url_path='')

@app.route('/')
def serve_index():
    # Serve the index.html file from the frontend folder
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    # Serve other static files (CSS, JS) from the frontend folder
    return send_from_directory(app.static_folder, path)

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        'locations': util.get_location_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/predict_home_price', methods=['GET', 'POST'])
def predict_home_price():
    total_sqft = float(request.form['total_sqft'])
    location = request.form['location']
    bhk = int(request.form['bhk'])
    bath = int(request.form['bath'])

    response = jsonify({
        'estimated_price': util.get_estimated_price(location, total_sqft, bhk, bath)
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    util.load_saved_artifacts()
    # Use host='0.0.0.0' for Render deployment
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
