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

  const { theme } = themeContext;

  return (
    <>
      {React.Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child, { style: { ...child.props.style, '--foreground-color': theme.foreground, '--background-color': theme.background } })
          : child
      )}
    </>
  );
};

export default ThemeProviderWrapper;