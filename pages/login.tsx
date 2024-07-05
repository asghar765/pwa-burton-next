import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Redirect or handle the user on successful login
    } catch (error) {
      console.error('An error occurred during Google login:', error.message, error.stack);
      setError('Google login failed. Please try again.');
    }
  };

  const loginWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect or handle the user on successful login
    } catch (error) {
      console.error('An error occurred during email login:', error.message, error.stack);
      setError('Email login failed. Please check your credentials and try again.');
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
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
          <button 
            onClick={loginWithEmail} 
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
          >
            Login with Email
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