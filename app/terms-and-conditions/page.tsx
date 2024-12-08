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

      <main className="w-full max-w-6xl space-y-8">
        <h1 className="text-4xl font-bold mb-10 text-center">
          <GradientText>Terms and Conditions</GradientText>
        </h1>
        <p className="text-center mb-6 text-blue-200">
          Version 3 - April 2024<br />
          Pakistan Welfare Association<br />
          Burton Upon Trent
        </p>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">1. Members Eligibility</h2>
          <p>Only Muslims can be members of Pakistan Welfare Association (PWA).</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">2. Membership Fee</h2>
          <p>Any new members must pay a membership fee plus the collection amount for that calendar year. Currently the membership fee is £150 as of January 2024. This may change with inflation and is reviewed periodically to reflect the costs incurred.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">3. Dependents Registration</h2>
          <p>All members will be given a membership number and will need to register their dependents so that the PWA Committee can gain an accurate picture of the actual number of people covered. Dependents include stepchildren and adopted children.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">4. Health Declaration</h2>
          <p>New members must be in good health, with no known terminal illnesses. Any long-term illnesses must be disclosed to the Committee for consideration during the membership process.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">5. Confidentiality</h2>
          <p>All data is confidentially stored under GDPR rules and will not be shared except for necessary processes when death occurs or for use within PWA.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">6-7. Payment Terms</h2>
          <p>Payments will need to be made within 28 days from collection date. After 21 days from collection a final reminder will be sent, thus allowing 7 days until the full 28 days required for collection.</p>
          <p>Any non-payment after this deadline is subject to a late payment fee of £30. Any further nonpayment will result in cancellation of membership and have to rejoin and must pay a new membership fee of £150. All costs are reviewed periodically to reflect inflation, changes will be communicated to members via their Collector Members or directly through a communication mechanism.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">8-11. Registration Requirements</h2>
          <ul className="list-disc pl-5">
            <li>Every married man will need to ensure they are registered separately from their parents or guardian.</li>
            <li>Every young male over the age of 18 must have membership in the association regardless of employment status, except for being in full time education until their 22nd birthday.</li>
            <li>No membership charges will apply to migrating members up until their 23rd birthday, where a new membership charge is applicable.</li>
            <li>As and when a member&apos;s child leaves full time education, they must also register as an individual member.</li>
            <li>Any young person who is 22 years of age or over and attends university must still ensure they are registered as members.</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">12-16. Special Cases</h2>
          <ul className="list-disc pl-5">
            <li>Unmarried females are not obliged to become members and will be covered under their parents&apos; membership until marriage.</li>
            <li>If a marriage separation occurs, both males and females must have separate memberships.</li>
            <li>Separated or divorced individuals must apply as separate members.</li>
            <li>Widowed ladies will be considered as the head of the family and must pay fees regularly.</li>
            <li>Males with multiple wives must explicitly register all dependents.</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">17-18. Assistance Offered</h2>
          <p>If a head member of family passes away, a £500 payment is offered to the widow or orphans under 18. If death occurs in Pakistan, £1,000 is offered. PWA will cover costs for both viable and non-viable foetus.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">19-21. Residency Requirements</h2>
          <p>Members living outside East Staffordshire Borough Council (ESBC) for work will still receive full benefits. Proof of ESBC residency is advisable. Legacy members (pre-2024) have different coverage terms compared to members who joined after 2024.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">22. Visitor Membership</h2>
          <p>Visitors can apply for temporary membership at a fixed rate of £50 plus last collection, which is non-refundable. Visitors must pay contributions and may need to become full members depending on their status.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">23-24. Repatriation Costs</h2>
          <p>Repatriation costs are limited to the average of the last 4 UK burials. The association is responsible for collection from any airport in England, with other costs being the family&apos;s responsibility.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">25. Financial Buffer</h2>
          <p>A buffer amount of £16,000 should be maintained in the bank account to cover immediate costs in case of unforeseen tragedies.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">26. Funeral Arrangements</h2>
          <p>PWA will only pay the sum of usual costs from their preferred funeral provider. Any extra arrangements are the family&apos;s responsibility.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">27. Committee Changes</h2>
          <p>Any changes to payments or rules must be voted in by the Committee and communicated to collector members and wider membership.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-blue-100 text-center">
          <p>By becoming a member of the Pakistan Welfare Association, you agree to abide by these terms and conditions outlined above.</p>
        </div>
      </main>

      <footer className="w-full max-w-4xl text-center text-blue-200 mt-12">
        <p>© 2024 Pakistan Welfare Association. All rights reserved.</p>
      </footer>
    </div>
  );
}
