import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const deleteMemberNumbers = async () => {
  try {
    console.log('Starting member number deletion...');
    
    // Get all members
    const membersRef = collection(db, 'members');
    const membersSnapshot = await getDocs(membersRef);
    
    console.log(`Found ${membersSnapshot.size} members to process`);
    
    // Update each member document
    const updatePromises = membersSnapshot.docs.map(async (memberDoc) => {
      const memberRef = doc(db, 'members', memberDoc.id);
      
      // Remove memberNumber field by setting it to null in Firestore
      await updateDoc(memberRef, {
        memberNumber: null,
        // If there's an old member number field, remove it too
        oldMemberNumber: null
      });
      
      console.log(`Deleted member number for document ID: ${memberDoc.id}`);
    });
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    console.log('Successfully deleted all member numbers');
  } catch (error) {
    console.error('Error deleting member numbers:', error);
    throw error;
  }
};

// Execute the function
deleteMemberNumbers()
  .then(() => {
    console.log('Member number deletion completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to delete member numbers:', error);
    process.exit(1);
  });
