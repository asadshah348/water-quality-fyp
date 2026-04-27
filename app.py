
# ==========================================================
# REAL-TIME WATER QUALITY MONITORING SYSTEM - FLASK VERSION
# ==========================================================

from flask import Flask, render_template, jsonify
import firebase_admin
from firebase_admin import credentials, db
import pandas as pd
import joblib
import os
import json
from datetime import datetime

app = Flask(__name__)

# ----------------------------------------------------------
# CONFIG
# ----------------------------------------------------------
FEATURES = [
    'Temperature',
    'Turbidity',
    'Water_Level',
    'TDS',
    'PH',
    'Pressure'
]

# WHO Drinking Water Quality Standards
WHO_STANDARDS = {
    'Temperature': {'min': 0, 'max': 30, 'unit': '°C', 'safe_range': '0-30°C'},
    'Turbidity': {'min': 0, 'max': 4, 'unit': 'NTU', 'safe_range': '≤ 4 NTU'},
    'Water_Level': {'min': 10, 'max': 80, 'unit': '%', 'safe_range': '10-80%'},
    'TDS': {'min': 0, 'max': 500, 'unit': 'mg/L', 'safe_range': '≤ 500 mg/L'},
    'PH': {'min': 6.5, 'max': 8.5, 'unit': '', 'safe_range': '6.5 - 8.5'},
    'Pressure': {'min': 850, 'max': 1200, 'unit': 'hPa', 'safe_range': '≥ 850 hPa'}
}

# WHO Anomaly Detection Thresholds
WHO_ANOMALY_THRESHOLDS = {
    'Temperature': {'min': 0, 'max': 35, 'critical': 40},
    'Turbidity': {'min': 0, 'max': 5, 'critical': 10},
    'Water_Level': {'min': 5, 'max': 90, 'critical': 95},
    'TDS': {'min': 0, 'max': 1000, 'critical': 1500},
    'PH': {'min': 6.0, 'max': 9.0, 'critical': 10.0},
    'Pressure': {'min': 800, 'max': 1200, 'critical': 700}
}

# ----------------------------------------------------------
# FIREBASE INIT (SAFE)
# ----------------------------------------------------------
def init_firebase():
    if not firebase_admin._apps:
        try:
            cred = credentials.Certificate(
                os.path.join(os.path.dirname(__file__), "firebase_key.json")
            )
            firebase_admin.initialize_app(cred, {
                "databaseURL": "https://water-ec24c-default-rtdb.firebaseio.com/"
            })
        except Exception as e:
            print(f"Firebase init error: {e}")
            return None
    return db.reference("/")

ref = init_firebase()

# ----------------------------------------------------------
# LOAD MODELS
# ----------------------------------------------------------
def load_models():
    try:
        rf = joblib.load("models/rf.pkl")
        iso = joblib.load("models/iso.pkl")
        scaler = joblib.load("models/scaler.pkl")
        return rf, iso, scaler
    except Exception as e:
        print(f"Model loading error: {e}")
        return None, None, None

rf, iso, scaler = load_models()

# ----------------------------------------------------------
# HELPER FUNCTIONS
# ----------------------------------------------------------
def get_sensor_data():
    """Read data from Firebase or return demo data"""
    try:
        if ref:
            data = ref.get()
        else:
            data = None
    except Exception as e:
        print(f"Firebase read error: {e}")
        data = None

    if data is None:
        # Demo data for testing
        data = {
            "Temperature": 24.5,
            "Turbidity": 2.3,
            "Level": 45.0,
            "TDS": 320,
            "PH": 7.2,
            "Pressure": 950,
            "Status": "NO_Leakage"
        }

    return data

def process_data(data):
    """Process raw sensor data"""
    row = {
        "Temperature": float(data.get("Temperature", 0)),
        "Turbidity": float(data.get("Turbidity", 0)),
        "Water_Level": float(data.get("Level", 0)),
        "TDS": float(data.get("TDS", 0)),
        "PH": float(data.get("PH", 7.0)),
        "Pressure": float(data.get("Pressure", 900)),
    }

    firebase_status = str(data.get("Status", "NO_Leakage"))

    return row, firebase_status

def predict_leakage(row, firebase_status):
    """Predict leakage using hybrid approach"""
    # ML Prediction
    if rf is not None and scaler is not None:
        X = pd.DataFrame([row], columns=FEATURES)
        X_scaled = scaler.transform(X)
        ml_leak = rf.predict(X_scaled)[0]
    else:
        ml_leak = 0

    # Hybrid Decision
    if firebase_status == "Leakage":
        return "Leakage", "critical"
    elif row["Pressure"] < 850:
        return "Leakage", "critical"
    elif row["Water_Level"] < 10 or row["Water_Level"] > 80:
        return "Leakage", "warning"
    elif ml_leak == 1:
        return "Leakage", "warning"
    else:
        return "No Leakage", "safe"

def detect_anomaly(row):
    """Detect anomaly based on WHO standards"""
    anomalies = []
    anomaly_details = {}

    for param, thresholds in WHO_ANOMALY_THRESHOLDS.items():
        value = row[param]

        if value < thresholds['min'] or value > thresholds['max']:
            severity = "critical" if (value < thresholds.get('critical', thresholds['min']) or 
                                     value > thresholds.get('critical', thresholds['max'])) else "warning"
            anomalies.append({
                "parameter": param,
                "value": value,
                "severity": severity,
                "message": f"{param} is {'below' if value < thresholds['min'] else 'above'} WHO safe limits"
            })
            anomaly_details[param] = {
                "status": "anomaly",
                "severity": severity,
                "value": value
            }
        else:
            anomaly_details[param] = {
                "status": "normal",
                "severity": "safe",
                "value": value
            }

    # ML Anomaly Detection
    if iso is not None and scaler is not None:
        X = pd.DataFrame([row], columns=FEATURES)
        X_scaled = scaler.transform(X)
        ml_anomaly = iso.predict(X_scaled)[0]
        if ml_anomaly == -1:
            anomalies.append({
                "parameter": "ML Pattern",
                "value": "N/A",
                "severity": "warning",
                "message": "Unusual pattern detected by ML model"
            })

    is_anomaly = len(anomalies) > 0

    return {
        "is_anomaly": is_anomaly,
        "anomaly_count": len(anomalies),
        "anomalies": anomalies,
        "details": anomaly_details
    }

def check_drinkable(row):
    """Check if water is drinkable according to WHO standards"""
    checks = {
        "TDS": {
            "value": row["TDS"],
            "limit": 500,
            "unit": "mg/L",
            "passed": row["TDS"] <= 500,
            "message": "TDS should be ≤ 500 mg/L"
        },
        "PH": {
            "value": row["PH"],
            "limit": "6.5 - 8.5",
            "unit": "",
            "passed": 6.5 <= row["PH"] <= 8.5,
            "message": "pH should be between 6.5 and 8.5"
        },
        "Turbidity": {
            "value": row["Turbidity"],
            "limit": 4,
            "unit": "NTU",
            "passed": row["Turbidity"] <= 4,
            "message": "Turbidity should be ≤ 4 NTU"
        }
    }

    is_drinkable = all(check["passed"] for check in checks.values())

    return {
        "is_drinkable": is_drinkable,
        "checks": checks
    }

def get_parameter_status(param, value):
    """Get status of a parameter based on WHO standards"""
    std = WHO_STANDARDS[param]
    if value < std['min'] or value > std['max']:
        return "unsafe"
    return "safe"

# ----------------------------------------------------------
# ROUTES
# ----------------------------------------------------------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/data")
def get_data():
    """API endpoint to get current sensor data and predictions"""
    try:
        raw_data = get_sensor_data()
        row, firebase_status = process_data(raw_data)

        # Predictions
        leakage_status, leakage_severity = predict_leakage(row, firebase_status)
        anomaly_result = detect_anomaly(row)
        drinkable_result = check_drinkable(row)

        # Parameter statuses
        param_statuses = {}
        for param in FEATURES:
            param_statuses[param] = {
                "value": round(row[param], 2),
                "unit": WHO_STANDARDS[param]['unit'],
                "safe_range": WHO_STANDARDS[param]['safe_range'],
                "status": get_parameter_status(param, row[param])
            }

        response = {
            "timestamp": datetime.now().isoformat(),
            "sensors": param_statuses,
            "leakage": {
                "status": leakage_status,
                "severity": leakage_severity
            },
            "anomaly": anomaly_result,
            "drinkable": drinkable_result,
            "raw_data": raw_data
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/history")
def get_history():
    """API endpoint to get historical data (placeholder)"""
    # In production, this would fetch from Firebase history or a database
    return jsonify({
        "message": "Historical data endpoint - integrate with your database",
        "data": []
    })

# ----------------------------------------------------------
# ERROR HANDLERS
# ----------------------------------------------------------
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ----------------------------------------------------------
# MAIN
# ----------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
