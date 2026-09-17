import React from 'react';
import { Container } from './Container';

export const GridOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <Container size="wide" className="h-full">
        <div className="w-full h-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-full">
          <div className="border-r border-white/[0.02] h-full" />
          <div className="border-r border-white/[0.02] h-full" />
          <div className="border-r border-white/[0.02] h-full hidden md:block" />
          <div className="border-r border-white/[0.02] h-full hidden md:block" />
          <div className="border-r border-white/[0.02] h-full hidden lg:block" />
          <div className="border-r border-white/[0.02] h-full hidden lg:block" />
        </div>
      </Container>
    </div>
  );
};
