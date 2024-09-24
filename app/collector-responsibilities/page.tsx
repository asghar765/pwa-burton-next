import Link from 'next/link';
import GradientText from '@/components/GradientText';

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

      <main className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold mb-10 text-center">
          <GradientText>Collector Responsibilities</GradientText>
        </h1>

        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Key Responsibilities:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Collect membership fees and donations from assigned members</li>
            <li>Maintain accurate records of all transactions</li>
            <li>Issue receipts for all payments received</li>
            <li>Report any issues or concerns to the finance committee</li>
            <li>Attend monthly collector meetings</li>
            <li>Promote the association&apos;s activities and goals</li>
            <li>Ensure compliance with financial regulations and policies</li>
          </ul>
        </section>

        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Important Guidelines:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Always be professional and courteous when interacting with members</li>
            <li>Maintain confidentiality of member information</li>
            <li>Use the provided collection tools and software</li>
            <li>Submit collected funds to the treasurer within 24 hours</li>
          </ul>
        </section>

        <p className="text-center mt-8">
          For any questions or additional information, please contact the Finance Committee.
        </p>
      </main>

      <footer className="w-full max-w-4xl text-center text-blue-200 mt-12">
        <p>© Pakistan Welfare Association. All rights reserved.</p>
      </footer>
    </div>
  );
}
