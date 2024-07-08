import firebase_admin
from firebase_admin import credentials, firestore, auth

def initialize_firebase(config):
    try:
        # Check if the Firebase app is already initialized
        if not firebase_admin._apps:
            # Initialize the Firebase app with the provided configuration
            cred = credentials.Certificate(config)
            firebase_admin.initialize_app(cred)
            print("Firebase app initialized successfully.")
        else:
            print("Firebase app is already initialized.")

        # Get the Firestore and Auth instances
        db = firestore.client()
        auth_instance = auth.Client(firebase_admin.get_app())

        print("Firestore and Auth instances retrieved successfully.")
        return db, auth_instance

    except firebase_admin.exceptions.InvalidArgumentError as e:
        print(f"Error initializing Firebase app: {str(e)}")
    except Exception as e:
        print(f"Error: {str(e)}")

# Firebase configuration
config = {
    "apiKey": "AIzaSyAd9Zg5iyK8vVFo5UjfZntNyyCtdSuhTIE",
    "authDomain": "bwaapp1.firebaseapp.com",
    "databaseURL": "https://bwaapp1-default-rtdb.europe-west1.firebasedatabase.app",
    "projectId": "bwaapp1",
    "storageBucket": "bwaapp1.appspot.com",
    "messagingSenderId": "698509084521",
    "appId": "1:698509084521:web:38e0db08bca05848dfdff8",
    "measurementId": "G-5Z8RVSZRXD"
}

# Test the Firebase initialization
db, auth_instance = initialize_firebase(config)