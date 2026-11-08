import React from 'react';

export const PageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'normal' | 'wide' | 'full';
}> = ({ children, className = '', maxWidth = 'normal' }) => {
  const maxWs = {
    normal: 'max-w-7xl',
    wide: 'max-w-(--breakpoint-2xl)',
    full: 'max-w-full',
  };

  return (
    <main className={`min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8 mx-auto ${maxWs[maxWidth]} ${className}`}>
      {children}
    </main>
  );
};
