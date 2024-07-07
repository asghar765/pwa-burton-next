// pwa-burton-next/context/themeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { themeConfig } from '../config/themeConfig';

interface ThemeContextType {
  theme: 'light' | 'dark';
  foreground: string;
  background: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []); 

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const currentThemeConfig = themeConfig[theme];

  return (
    <ThemeContext.Provider value={{ theme, foreground: currentThemeConfig.foreground, background: currentThemeConfig.background, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};