import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAd9Zg5iyK8vVFo5UjfZntNyyCtdSuhTIE",
  authDomain: "bwaapp1.firebaseapp.com",
  databaseURL: "https://bwaapp1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bwaapp1",
  storageBucket: "bwaapp1.appspot.com",
  messagingSenderId: "698509084521",
  appId: "1:698509084521:web:38e0db08bca05848dfdff8",
  measurementId: "G-5Z8RVSZRXD"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, firebaseConfig };
