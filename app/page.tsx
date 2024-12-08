'use client';

import React from 'react';
import Link from 'next/link';

const GradientText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 ${className}`}>
    {children}
  </span>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-2xl font-semibold mb-4"><GradientText>{title}</GradientText></h2>
    {children}
  </section>
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 bg-gradient-to-b from-gray-900 to-blue-900 text-gray-100">
      <header className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div className="text-3xl font-bold">
          <GradientText>PWA</GradientText>
        </div>
        <nav>
          <Link href="/login" passHref>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center">
              Login
            </button>
          </Link>
        </nav>
      </header>

      <main className="w-full max-w-5xl space-y-8">
        <h1 className="text-4xl font-bold mb-10 text-center">
          <GradientText>Pakistan Welfare Association Updates</GradientText>
        </h1>

        <Section title="What we've been doing">
          <div className="space-y-4 text-blue-100">
            <p>Brother Sajid has resigned and a new Committee was formally created. We would like to thank brother Sajid for his previous efforts, and he will continue helping the Committee where possible in an informal capacity.</p>
            
            <p>New Committee, <Link href="/terms-and-conditions" className="text-blue-300 hover:underline">terms and conditions</Link>, and registration, formalise roles for <Link href="/collector-responsibilities" className="text-blue-300 hover:underline">Collectors Responsibilities</Link></p>
            
            <h3 className="text-xl font-semibold mt-6">New Committee as of December 2023</h3>
            <ul className="list-disc pl-5">
              <li>Chairperson: Anjum Riaz & Habib Mushtaq</li>
              <li>Secretary: Tariq Majid</li>
              <li>Treasurer: Faizan Qadiri</li>
            </ul>
            
            <p>Terms have been updated.</p>
            <p>Website has been created and coded by Zaheer Asghar</p>
          </div>
        </Section>

        <Section title="What we expect">
          <ul className="list-disc pl-5 space-y-2 text-blue-100">
            <li>All members have been given membership numbers. Please contact your collector to find this out.</li>
            <li>Please login individually and fill in required data.</li>
            <li>We expect timely payments that are up to date.</li>
            <li>Collectors who are timely and up to date, thank you, and please continue with your efforts. Those not up to date, please find out your membership number from your collector, then please login online and make payment as soon as possible. If payments are not up to date then you will not be covered.</li>
          </ul>
        </Section>

        <Section title="Important Information">
          <div className="space-y-4 text-blue-100">
            <p>Trialled so far online payment using Stripe - not enough uptake, sidelined for possible future use.</p>
            
            <p className="font-semibold text-yellow-300">Check with your collector if payments up to date, if not up to date YOU ARE NOT COVERED! The responsibility to pay is on the member, not the Collector.</p>
            
            <p>Unfortunately we are not taking on new members. So if Collectors are in arrears, they will be given deadlines to clear arrears. After this deadline you will no longer be considered to be a member of Pakistan Welfare Committee, and currently we are not taking any more members on so you will be advised to join another Committee if they are willing to take new members.</p>
            
            <p>Only members who become of age will be added as new members.</p>
            
            <p>We humbly request everyone keeps their payments up to date, the best method is to pay directly <Link href="/payment" className="text-blue-300 hover:underline">here</Link></p>
            
            <p>If there are members in the community that feel they can assist in a voluntary capacity to improve aspects of the processes involved, please get in touch with the Committee.</p>
          </div>
        </Section>

        <Section title="Medical Examiner Process">
          <div className="space-y-4 text-blue-100">
            <p>To understand our comprehensive Medical Examiner Death Certification process, please review our detailed <Link href="/flow-chart" className="text-blue-300 hover:underline">Medical Examiner Flow Chart</Link>.</p>
            <p>This flow chart provides a step-by-step guide to the death certification process, ensuring transparency and clarity for all members.</p>
          </div>
        </Section>
      </main>

      <footer className="w-full max-w-5xl text-center text-blue-200 mt-12">
        <p>© 2024 SmartFIX Technologies, Burton Upon Trent. All rights reserved.</p>
      </footer>
    </div>
  );
}
