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
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <div className={inter.className}>
              <nav>
                <Link href="/dashboard">Dashboard</Link>
                <ThemeSwitcher />
              </nav>
              {children}
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
