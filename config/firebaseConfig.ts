import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBIdEm_bTr7X_AYKrW_e5-vjNxpu8vRSKg",
  authDomain: "bwaapp1.firebaseapp.com",
  databaseURL: "https://bwaapp1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bwaapp1",
  storageBucket: "bwaapp1.appspot.com",
  messagingSenderId: "698509084521",
  appId: "1:698509084521:web:38e0db08bca05848dfdff8",
  measurementId: "G-5Z8RVSZRXD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, firebaseConfig, auth };
