import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { diagnoseRoute } from '../utils/routeDiagnostics';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    diagnoseRoute(router.asPath, false).catch(console.error);
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000); // Redirects after 5 seconds
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-gray-100">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">404 - Page Not Found</h1>
      <p className="mt-3 text-lg text-blue-200">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link href="/">
        <span className="mt-6 text-blue-400 hover:underline cursor-pointer">Go back home</span>
      </Link>
      <p className="mt-2 text-gray-400">Automatically redirecting in 5 seconds...</p>
    </div>
  );
}