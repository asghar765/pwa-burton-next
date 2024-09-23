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

        {/* Rest of the content remains the same */}
      </main>

      <footer className="w-full max-w-4xl text-center text-blue-200 mt-12">
        <p>© Pakistan Welfare Association. All rights reserved.</p>
      </footer>
    </div>
  );
}
