'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { initializeApp } from 'firebase/app';
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
const auth = getAuth(app);

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

const GradientText = ({ children, className = '' }: GradientTextProps) => (
  <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 ${className}`}>
    {children}
  </span>
);

const LoginButton = () => {
  return (
    <div>
      <Link href="/login" passHref>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center"
        >
          Login
        </button>
      </Link>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 bg-gradient-to-b from-gray-900 to-blue-900 text-gray-100">
      <header className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div className="text-2xl font-bold">
          <GradientText>PWA</GradientText>
        </div>
        <nav>
          <LoginButton />
        </nav>
      </header>

      <div className="text-center mb-16">
        <h1 className="text-5xl mb-4">
          <GradientText className="">Pakistan Welfare Association</GradientText>
        </h1>
        <p className="text-xl text-blue-200 mb-8">Supporting our Muslim community in Burton Upon Trent since 2024</p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/registration"
            className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Join PWA
          </Link>
          <a
            href="https://buy.stripe.com/eVabMD6D92oj78QfYY"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Pay Now
          </a>
        </div>
      </div>

      <div id="about" className="w-full max-w-5xl mb-16">
        <h2 className="text-3xl mb-4">
          <GradientText className="">About Us</GradientText>
        </h2>
        <p className="text-blue-100 mb-4">
          The Pakistan Welfare Association (PWA) is dedicated to supporting the Muslim community in Burton Upon Trent.
          We provide essential services including financial assistance and funeral arrangements.
        </p>
        <p className="text-blue-100">
          Our association is built on the principles of community support, welfare, and mutual aid. We strive to ensure
          that every member of our community has access to the help they need in times of joy and sorrow.
        </p>
      </div>

      <div id="services" className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-16">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 text-blue-400 mb-4">
            <IconUsers />
          </div>
          <h2 className="text-xl mb-2">
            <GradientText className="">Community Support</GradientText>
          </h2>
          <p className="text-blue-100">We provide assistance to our community members in times of need, including financial support for bereaved families.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 text-blue-400 mb-4">
            <IconHeart />
          </div>
          <h2 className="text-xl mb-2">
            <GradientText className="">Funeral Services</GradientText>
          </h2>
          <p className="text-blue-100">We offer comprehensive funeral arrangements, including Ghusl facilities and burial services for members.</p>
        </div>
      </div>

      <div id="membership" className="w-full max-w-5xl mb-16">
        <h2 className="text-3xl mb-4">
          <GradientText className="">Membership Information</GradientText>
        </h2>
        <ul className="list-disc list-inside text-blue-100 space-y-2">
          <li>Membership is open to Muslims in the Burton Upon Trent area.</li>
          <li>Current membership fee is £150 as of January 2024, plus annual collection amounts.</li>
          <li>Members must register their dependents for accurate coverage.</li>
          <li>Young males over 18 must have separate membership.</li>
          <li>Special provisions are available for unmarried females, widows, and those with multiple spouses.</li>
          <li>Residency within East Staffordshire Borough Council area is required for full benefits.</li>
        </ul>
      </div>

      <div id="contact" className="w-full max-w-5xl mb-16">
        <h2 className="text-3xl mb-4">
          <GradientText className="">Contact Us</GradientText>
        </h2>
        <p className="text-blue-100 mb-4">
          For more information about our services, membership, or to speak with a PWA representative, please contact us:
        </p>
        <p className="text-blue-100">
          Email: pwaburton@proton.me<br />
          Phone: +44 1234 567890<br />
          Address: 123 Main Street, Burton Upon Trent, DE14 1AA
        </p>
      </div>

      <footer className="w-full max-w-5xl text-center text-blue-200">
        <p>&copy; 2024 Pakistan Welfare Association, Burton Upon Trent. All rights reserved.</p>
      </footer>
    </div>
  );
}