import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

const GradientText = ({ children, className = '' }: GradientTextProps) => (
  <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 ${className}`}>
    {children}
  </span>
);

const LoginPage = () => {
  const router = useRouter();
  const [memberNumber, setMemberNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google Sign-In successful:', result);

      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date(),
          role: 'user'
        });
        console.log('New user document created in Firestore');
      } else {
        console.log('Existing user logged in');
      }

      router.push('/dashboard');
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
  
      console.error('An error occurred during Google login:', errorCode, errorMessage, email, credential);
  
      switch (errorCode) {
        case 'auth/account-exists-with-different-credential':
          setError('Email already associated with another account.');
          break;
        case 'auth/auth-domain-config-required':
          setError('Authentication domain configuration is required.');
          break;
        case 'auth/cancelled-popup-request':
          setError('The popup has been closed by the user before finalizing the operation.');
          break;
        case 'auth/operation-not-allowed':
          setError('Operation not allowed. Please enable Google Sign-In in the Firebase console.');
          break;
        case 'auth/user-disabled':
          setError('The user account has been disabled by an administrator.');
          break;
        default:
          setError('Google login failed. Please try again.');
          break;
      }
    }
  };

  const loginWithMemberNumber = async () => {
    try {
      // Query Firestore to find the user document with the given member number
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("memberNumber", "==", memberNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No user found with this member number.');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Use the email associated with the member number to sign in
      await signInWithEmailAndPassword(auth, userData.email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('An error occurred during member number login:', error.message, error.stack);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-blue-900 text-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-4xl mb-8 text-center">
          <GradientText>PWA Login</GradientText>
        </h1>
        
        <div className="bg-gray-800 p-8 rounded-lg shadow-md">
          <input 
            type="text" 
            placeholder="Member Number" 
            onChange={(e) => setMemberNumber(e.target.value)} 
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
          <button 
            onClick={loginWithMemberNumber} 
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
          >
            Login with Member Number
          </button>
          <button
            onClick={loginWithGoogle}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Login with Google
          </button>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </div>
        
        <p className="text-blue-200 mt-8 text-center">
          Not a member yet? <Link href="/registration" className="text-blue-400 hover:underline">Join PWA</Link>
        </p>
      </div>
      
      <footer className="mt-16 text-center text-blue-200">
        <p>&copy; 2024 Pakistan Welfare Association, Burton Upon Trent. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
