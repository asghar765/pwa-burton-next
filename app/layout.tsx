import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from 'react';
import { ThemeProvider } from '../context/themeContext';
import { AuthProvider } from '../context/authContext';
import ThemeSwitcher from '../components/ThemeSwitcher';
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "PWA Burton",
  description: "Pakistan Welfare Association Burton Upon Trent",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <nav className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex flex-col xs:flex-row justify-between items-center">
                  <Link href="/" className="text-xl font-bold mb-2 xs:mb-0">PWA Burton</Link>
                  <div className="flex items-center space-x-4">
                    <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                    <ThemeSwitcher />
                  </div>
                </div>
              </nav>
              <main className="flex-grow container mx-auto py-4">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
