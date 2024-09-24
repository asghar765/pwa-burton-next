'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const GradientText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 ${className}`}>
    {children}
  </span>
);

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState('directDebit');
  const [memberNumber, setMemberNumber] = useState('');
  const [existingMemberNumber, setExistingMemberNumber] = useState('');

  const [accountHolderName, setAccountHolderName] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'directDebits'), {
        memberNumber: existingMemberNumber,
        accountHolderName,
        sortCode,
        accountNumber,
        paymentMethod,
        createdAt: new Date(),
      });
      console.log('Document written with ID: ', docRef.id);
      // Here you would handle successful submission (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error('Error adding document: ', error);
      // Here you would handle errors (e.g., show an error message to the user)
    }
  };

  return (    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-b from-gray-900 to-blue-900 text-gray-100">
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <Link href="/">
          <div className="text-3xl font-bold cursor-pointer">
            <GradientText>PWA</GradientText>
          </div>
        </Link>
        <nav>
          <Link href="/login" passHref>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
              Login
            </button>
          </Link>
        </nav>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold mb-10 text-center">
          <GradientText>Payment</GradientText>
        </h1>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-blue-300 mb-2">Existing Member Number</label>
            <input 
              type="text" 
              value={existingMemberNumber}
              onChange={(e) => setExistingMemberNumber(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white" 
              required 
              placeholder="Enter your existing member number"
            />
          </div>
          <div className="mb-4">
            <label className="block text-blue-300 mb-2">Payment Method</label>
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="directDebit">Direct Debit (HSBC)</option>
              <option value="onlinePayment">Online Payment</option>
            </select>
          </div>
          {paymentMethod === 'directDebit' && (
            <>
              <div className="mb-4">
                <label className="block text-blue-300 mb-2">Account Holder Name</label>
                <input 
                  type="text" 
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-blue-300 mb-2">Sort Code</label>
                <input 
                  type="text" 
                  value={sortCode}
                  onChange={(e) => setSortCode(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-blue-300 mb-2">Account Number</label>
                <input 
                  type="text" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white" 
                  required 
                />
              </div>
            </>
          )}

          {paymentMethod === 'onlinePayment' && (
            <div className="mb-4">
              <label className="block text-blue-300 mb-2">Amount</label>
              <input type="number" className="w-full p-2 rounded bg-gray-700 text-white" required />
            </div>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
            {paymentMethod === 'directDebit' ? 'Set Up Direct Debit' : 'Make Payment'}
          </button>
        </form>

        <section className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
          <p className="text-blue-100">
            Direct Debit payments are processed through HSBC. This is a secure and convenient way to ensure your membership fees are always up to date. If you prefer to make a one-time online payment, you can select that option above.
          </p>
        </section>
      </main>

      <footer className="w-full max-w-4xl text-center text-blue-200 mt-12">
        <p>© 2024 Pakistan Welfare Association. All rights reserved.</p>
      </footer>
    </div>
  );
}
