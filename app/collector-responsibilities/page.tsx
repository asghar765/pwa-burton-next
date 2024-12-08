'use client';

import React from 'react';
import Link from 'next/link';

const GradientText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 ${className}`}>
    {children}
  </span>
);

export default function CollectorResponsibilities() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-b from-gray-900 to-blue-900 text-gray-100">
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <Link href="/">
          <div className="text-3xl font-bold cursor-pointer">
            <GradientText>PWA</GradientText>
          </div>
        </Link>
        <nav>
          <Link href="/login">
            <button type="button" className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
              Login
            </button>
          </Link>
        </nav>
      </header>

      <main className="w-full max-w-6xl space-y-8">
        <h1 className="text-4xl font-bold mb-10 text-center">
          <GradientText>PWA Collector Member Responsibilities</GradientText>
        </h1>

        <section className="bg-gray-800 p-6 rounded-lg shadow-lg text-blue-100">
          <p className="mb-4">A Collector member is a senior member of the PWA who is responsible for a specific number of paying members who are part of the death committee.</p>
          
          <h2 className="text-2xl font-semibold mb-4">Collector Responsibilities:</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li>Act as the representative of the death committee for each member on their list.</li>
            <li>Act as first point of contact for any enquiries from members or prospective members.</li>
            <li>Register new members with the death committee.</li>
            <li>Communicate announcements from death committee to members.</li>
            <li>Collect member&apos;s fees whenever a collection is due.</li>
            <li>Keep a record of all members&apos; payments made into PWA bank account, including:
              <ul className="list-disc list-inside pl-5 mt-2">
                <li>Date paid</li>
                <li>Reference used</li>
                <li>Bank account name</li>
              </ul>
              <p className="mt-2">When consolidating collection with treasurer, share record/evidence of online payments if requested.</p>
            </li>
            <li>Act as conduit between the members and death committee Senior Leadership Team (SLT) for any day-to-day issues.</li>
            <li>Attending Collectors meetings with other members.</li>
            <li>Provide guidance to new members and prospective members seeking membership with the PWA.</li>
            <li>Feedback any issues or concerns to the PWA SLT.</li>
          </ol>
        </section>

        <section className="bg-gray-800 p-6 rounded-lg shadow-lg text-blue-100 text-center">
          <p>As a Collector Member, you play a crucial role in the smooth operation and communication within the Pakistan Welfare Association.</p>
        </section>
      </main>

      <footer className="w-full max-w-4xl text-center text-blue-200 mt-12">
        <p>© 2024 Pakistan Welfare Association. All rights reserved.</p>
      </footer>
    </div>
  );
}
