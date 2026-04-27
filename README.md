# 💧 Real-Time Water Quality Monitoring System

A Flask-based web application for real-time water quality monitoring with ML-powered anomaly detection and WHO standards compliance checking.

## Features

- **Real-time Dashboard** with live sensor readings
- **Animated Dial Gauges** for all 6 parameters (Temperature, Turbidity, Water Level, TDS, pH, Pressure)
- **WHO Standards Compliance** checking for all parameters
- **AI Predictions**: Leakage Detection, Anomaly Detection, Drinkability Analysis
- **Interactive Charts**: Trend lines, Comparison bars, Water level history, Safety distribution
- **Firebase Integration** for real-time IoT sensor data
- **Machine Learning** models (Random Forest + Isolation Forest) for predictions
- **Auto-refresh** every 5 seconds

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Add your firebase_key.json to the project root

# 3. Add your ML models to models/ directory
# models/rf.pkl, models/iso.pkl, models/scaler.pkl

# 4. Run the app
python app.py
```

Open browser: **http://localhost:5000**

## WHO Drinking Water Standards Used

| Parameter | Safe Range | Unit |
|-----------|-----------|------|
| Temperature | 0 - 30 | °C |
| Turbidity | ≤ 4 | NTU |
| Water Level | 10 - 80 | % |
| TDS | ≤ 500 | mg/L |
| pH | 6.5 - 8.5 | - |
| Pressure | ≥ 850 | hPa |

## API Endpoints

- `GET /` - Main dashboard
- `GET /api/data` - Current sensor data with predictions
- `GET /api/history` - Historical data
