import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { AuthProvider } from './AuthProvider';
import { CursorProvider } from '@/components/cursor/CursorContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    // future flags silence the React Router v7 migration warnings and
    // opt in to the v7 behavior (startTransition wrapping + splat resolution)
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
