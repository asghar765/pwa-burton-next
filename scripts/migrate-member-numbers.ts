import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { migrateMemberNumbers } from '../utils/memberUtils.js';

// Directly import Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function runMigration() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Uncomment and adjust if using local emulator
    // connectFirestoreEmulator(db, 'localhost', 8080);

    console.log('Starting member number migration...');
    console.log('Firebase configuration:', {
      projectId: firebaseConfig.projectId,
      apiKey: firebaseConfig.apiKey ? 'REDACTED' : 'MISSING'
    });

    await migrateMemberNumbers(db);
    
    console.log('Member number migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed with detailed error:', error);
    
    // Log specific error details
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    process.exit(1);
  }
}

runMigration();
