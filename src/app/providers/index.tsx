import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { AuthProvider } from './AuthProvider';
import { CursorProvider } from '@/components/cursor/CursorContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SmoothScrollProvider>
          <CursorProvider>
            {children}
          </CursorProvider>
        </SmoothScrollProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
