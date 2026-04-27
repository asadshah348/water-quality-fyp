# Setup Guide

## Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

## Step 2: Configure Firebase
1. Download your Firebase service account key
2. Save as `firebase_key.json` in project root
3. Update database URL in `app.py` if needed

## Step 3: Add ML Models
Place trained models in `models/`:
- `rf.pkl` - Random Forest
- `iso.pkl` - Isolation Forest  
- `scaler.pkl` - StandardScaler

## Step 4: Run
```bash
python app.py
```

The app includes demo data when Firebase is unavailable for testing.
