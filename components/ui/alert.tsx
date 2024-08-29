import React from 'react';

interface AlertProps {
  variant: 'default' | 'destructive' | 'success';
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ variant = 'default', children }) => {
  const baseStyles = 'p-4 rounded-md mb-4';
  const variantStyles = {
    default: 'bg-blue-100 text-blue-700',
    destructive: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`} role="alert">
      {children}
    </div>
  );
};

export const AlertTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="font-bold mb-1">{children}</h3>
);

export const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p>{children}</p>
);