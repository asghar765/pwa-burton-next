'use client';

import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import '../styles/tailwind.css';

const AuthProviderWithNoSSR = dynamic(() => import('../context/authContext').then((mod) => mod.AuthProvider), {
  ssr: false,
});

const ThemeProviderWithNoSSR = dynamic(() => import('../context/themeContext').then((mod) => mod.ThemeProvider), {
  ssr: false,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  console.log(`MyApp component rendered at ${new Date().toISOString()}`);

  useEffect(() => {
    console.log(`MyApp useEffect triggered at ${new Date().toISOString()}`);
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <AuthProviderWithNoSSR>
      <ThemeProviderWithNoSSR>
        <Head>
          {/* Favicon will be handled by a separate file */}
          <title>PWA App</title>
        </Head>
        <Component {...pageProps} />
      </ThemeProviderWithNoSSR>
    </AuthProviderWithNoSSR>
  );
};

export default MyApp;
