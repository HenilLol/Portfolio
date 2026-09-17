import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const CreativeReturnNav: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 text-center space-y-8">
      <div className="space-y-2">
        <div className="font-mono text-xs text-accent tracking-widest uppercase">
          END OF CREATIVE SPECIFICATION // 07
        </div>
        <h3 className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
          Continue Exploration
        </h3>
        <p className="font-mono text-xs text-foreground-muted tracking-widest uppercase max-w-md mx-auto">
          Return to engineering worlds, technical architecture, or system overview.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link to="/#projects">
          <Button variant="magnetic" className="w-full sm:w-auto tracking-widest text-xs uppercase px-6 py-3">
            ← RETURN TO PROJECT UNIVERSE
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" className="w-full sm:w-auto tracking-widest text-xs uppercase px-6 py-3">
            PORTFOLIO OVERVIEW ↑
          </Button>
        </Link>
      </div>
    </section>
  );
};
