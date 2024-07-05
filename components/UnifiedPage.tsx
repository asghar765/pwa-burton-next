import React from 'react';
import { useTheme } from '../context/themeContext';

interface UnifiedPageProps {
  children: React.ReactNode;
}

const UnifiedPage: React.FC<UnifiedPageProps> = ({ children }) => {
  const { theme } = useTheme();

  const unifiedPageStyle = {
    color: theme.foreground,
    backgroundColor: theme.background,
  };

  return (
    <div style={unifiedPageStyle} className="min-h-screen flex flex-col">
      {children}
    </div>
  );
};

export default UnifiedPage;