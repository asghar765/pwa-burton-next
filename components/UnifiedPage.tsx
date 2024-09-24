// pwa-burton-next/components/UnifiedPage.tsx
import React, { useContext } from 'react';
import { ThemeContext } from '../context/themeContext';
import { auth } from '../config/firebaseConfig';

interface UnifiedPageProps {
  children: React.ReactNode;
}

const UnifiedPage: React.FC<UnifiedPageProps> = ({ children }) => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('UnifiedPage must be used within a ThemeProvider');
  }

  const { foreground, background } = themeContext;

  return (
    <div className="min-h-screen w-full p-2 xs:p-4 sm:p-6 md:p-8" style={{ color: foreground, backgroundColor: background }}>
      {children}
    </div>
  );
};

export default UnifiedPage;
