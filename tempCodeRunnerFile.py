def init_firebase():
    if not firebase_admin._apps:
        try:
            # Try environment variable first (for Render deployment)
            firebase_key_json = os.environ.get('FIREBASE_KEY_JSON')
            if firebase_key_json:
                cred = credentials.Certificate(json.loads(firebase_key_json))
                print("[FIREBASE] Using credentials from environment variable")
            else:
                # Fallback to local file (for development)
                key_path = os.path.join(os.path.dirname(__file__), "firebase_key.json")
                if os.path.exists(key_path):
                    cred = credentials.Certificate(key_path)
                    print(f"[FIREBASE] Using credentials from file: {key_path}")
                else:
                    print("[FIREBASE] No credentials found - will use demo data")
                    return None
            
            firebase_admin.initialize_app(cred, {
                "databaseURL": "https://water-ec24c-default-rtdb.firebaseio.com/"
            })
            print("[FIREBASE] Initialized successfully!")
        except Exception as e:
            print(f"[FIREBASE] Init error: {e}")
            return None
    return db.reference("/")

ref = init_firebase()