// pwa-burton-next/components/ThemeProviderWrapper.tsx
import React, { ReactNode, cloneElement, isValidElement, useContext } from 'react';
import { ThemeContext } from '../context/themeContext';

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

const ThemeProviderWrapper = ({ children }: ThemeProviderWrapperProps) => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('ThemeProviderWrapper must be used within a ThemeProvider');
  }

  const { foreground, background } = themeContext;

  const addThemeToChild = (child: React.ReactElement) => {
    const existingStyle = child.props.style || {};

    const newStyle = {
      ...existingStyle,
      '--foreground-color': foreground,
      '--background-color': background,
    };

    if (typeof child.type === 'string' || (typeof child.type === 'function' && 'propTypes' in child.type)) {
      return cloneElement(child, { style: newStyle });
    }

    return child;
  };

  return (
    <>
      {React.Children.map(children, (child) =>
        isValidElement(child) ? addThemeToChild(child) : child
      )}
    </>
  );
};

export default ThemeProviderWrapper;