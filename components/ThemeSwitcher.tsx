'use client';

import React from 'react';
import { useTheme } from '../context/themeContext';

const ThemeSwitcher: React.FC = () => {
  const { toggleTheme, theme } = useTheme();

  const buttonStyles = theme === 'light'
    ? 'p-2 text-sm text-white bg-gray-800 rounded'
    : 'p-2 text-sm text-black bg-gray-200 rounded';

  return (
    <button onClick={toggleTheme} className={buttonStyles}>
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
};

export default ThemeSwitcher;
