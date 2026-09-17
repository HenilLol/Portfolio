import React from 'react';
import { AppProviders } from '@/app/providers';
import { AppRoutes } from '@/app/routes';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background-surface focus:border focus:border-accent focus:text-accent focus:font-mono focus:text-xs focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;
