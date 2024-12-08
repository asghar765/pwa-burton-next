'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const GradientText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 ${className}`}>
    {children}
  </span>
);

export default function FlowChart() {
  const [scale, setScale] = useState(1);

  const increaseScale = () => setScale(Math.min(2, scale + 0.25));
  const decreaseScale = () => setScale(Math.max(0.5, scale - 0.25));

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
          <GradientText>Medical Examiner Death Certification Process</GradientText>
        </h1>

        <section className="bg-gray-800 p-6 rounded-lg shadow-lg text-blue-100 text-center">
          <h2 className="text-2xl font-semibold mb-4">Flow Chart</h2>
          
          <div className="flex justify-center items-center space-x-4 mb-4">
            <button 
              onClick={decreaseScale} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              -
            </button>
            <span>Zoom: {Math.round(scale * 100)}%</span>
            <button 
              onClick={increaseScale} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              +
            </button>
          </div>

          <div className="w-full overflow-auto bg-white p-4 rounded">
            <object 
              data="/flow-chart/Flowchart-ME-Process-NBC-Final-1.pdf" 
              type="application/pdf" 
              width="100%" 
              height="600px"
              className="border-none"
            >
              <p>Your browser does not support PDFs. 
                <Link 
                  href="/flow-chart/Flowchart-ME-Process-NBC-Final-1.pdf" 
                  target="_blank" 
                  className="text-blue-300 hover:underline"
                >
                  Download PDF
                </Link>
              </p>
            </object>
          </div>

          <div className="mt-4">
            <Link 
              href="/flow-chart/Flowchart-ME-Process-NBC-Final-1.pdf" 
              target="_blank" 
              className="text-blue-300 hover:underline"
            >
              Open PDF in New Tab
            </Link>
          </div>
        </section>

        <section className="bg-gray-800 p-6 rounded-lg shadow-lg text-blue-100">
          <h2 className="text-2xl font-semibold mb-4">Process Overview</h2>
          <p>The Medical Examiner Death Certification Process is a critical workflow that ensures proper documentation and verification of death circumstances.</p>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Key Steps:</h3>
          <ul className="list-disc pl-5">
            <li>Identifying the Attending Medical Practitioner</li>
            <li>Completing the Medical Certificate of Cause of Death (MCCD)</li>
            <li>Medical Examiner Review</li>
            <li>Potential Coroner Involvement</li>
            <li>Death Registration</li>
          </ul>
        </section>

        <section className="bg-gray-800 p-6 rounded-lg shadow-lg text-blue-100 text-center">
          <p className="italic">
            © 2024 National Burial Council. All rights reserved. 
            Not to be reproduced without permission or approval of National Burial Council.
          </p>
        </section>
      </main>

      <footer className="w-full max-w-4xl text-center text-blue-200 mt-12">
        <p>© 2024 Pakistan Welfare Association. All rights reserved.</p>
      </footer>
    </div>
  );
}
