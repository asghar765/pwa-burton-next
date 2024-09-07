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
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <AuthProviderWithNoSSR>
      <ThemeProviderWithNoSSR>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </ThemeProviderWithNoSSR>
    </AuthProviderWithNoSSR>
  );
};

export default MyApp;
