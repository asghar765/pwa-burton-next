'use client';

import React from 'react';
import Link from 'next/link';

const GradientText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 ${className}`}>
    {children}
  </span>
);

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-b from-gray-900 to-blue-900 text-gray-100">
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
          <GradientText>Terms and Conditions</GradientText>
        </h1>

        <section className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Membership</h2>
          <ul className="list-disc pl-5 space-y-2 text-blue-100">
            <li>Membership is open to Muslims residing in the Burton Upon Trent area.</li>
            <li>Current membership fee is £150 as of January 2024, plus annual collection amounts.</li>
            <li>Members must register their dependents for accurate coverage.</li>
            <li>Young males over 18 must have separate membership.</li>
            <li>Special provisions are available for unmarried females, widows, and those with multiple spouses.</li>
            <li>Residency within East Staffordshire Borough Council area is required for full benefits.</li>
          </ul>
        </section>

        <section className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Payments</h2>
          <ul className="list-disc pl-5 space-y-2 text-blue-100">
            <li>Members are responsible for keeping their payments up to date.</li>
            <li>Payments can be made through collectors or directly online.</li>
            <li>Members not up to date with payments will not be covered.</li>
            <li>Collectors will be given deadlines to clear arrears.</li>
          </ul>
        </section>

        <section className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
          <ul className="list-disc pl-5 space-y-2 text-blue-100">
            <li>Financial assistance for bereaved families.</li>
            <li>Access to comprehensive funeral arrangements, including Ghusl facilities and burial services.</li>
            <li>Community support in times of need.</li>
          </ul>
        </section>

        <section className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Amendments</h2>
          <p className="text-blue-100">The Pakistan Welfare Association reserves the right to amend these terms and conditions. Members will be notified of any changes.</p>
        </section>
      </main>

      <footer className="w-full max-w-4xl text-center text-blue-200 mt-12">
        <p>© 2024 Pakistan Welfare Association. All rights reserved.</p>
      </footer>
    </div>
  );
}
