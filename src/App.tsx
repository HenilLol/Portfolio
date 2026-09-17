import React from 'react';
import { AppProviders } from '@/app/providers';
import { AppRoutes } from '@/app/routes';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;
