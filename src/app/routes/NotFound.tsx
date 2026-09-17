import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/navigation/Header';
import { Button } from '@/components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground bg-grain flex flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col items-center justify-center p-6 text-center focus:outline-none">
        <span className="font-mono text-xs text-accent tracking-widest uppercase mb-2">404 Error</span>
        <h1 className="font-editorial text-4xl font-bold uppercase mb-4 text-foreground">Coordinate Unmapped</h1>
        <p className="font-mono text-xs text-foreground-muted mb-8 max-w-sm">
          The requested system node does not exist within the architecture.
        </p>
        <Link to="/">
          <Button variant="outline">Return to Origin</Button>
        </Link>
      </main>
    </div>
  );
};
