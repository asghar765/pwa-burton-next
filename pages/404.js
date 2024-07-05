import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { diagnoseRoute } from '../utils/routeDiagnostics';
import { FeedbackForm } from '../components/FeedbackForm';

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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-3 text-lg">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link href="/">
        <a className="mt-6 text-blue-600 hover:underline">Go back home</a>
      </Link>
      <p className="mt-2 text-gray-600">Automatically redirecting in 5 seconds...</p>
      <FeedbackForm path={router.asPath} />
    </div>
  );
}