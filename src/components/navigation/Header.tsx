import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuTrigger } from './MenuTrigger';
import { NavigationOverlay } from './NavigationOverlay';
import { Container } from '@/components/ui/layout/Container';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors">
        <Container size="wide" className="h-full flex items-center justify-between">
          {/* Minimal editorial brand */}
          <Link
            to="/"
            className="group flex items-center gap-2 font-editorial text-sm font-bold tracking-widest text-foreground uppercase hover:text-accent transition-colors"
          >
            <span>HENIL</span>
            <span className="text-foreground-muted font-mono text-xs font-normal">/</span>
            <span className="font-mono text-[10px] text-foreground-secondary tracking-widest uppercase">
              STUDIO
            </span>
          </Link>

          {/* Minimal Menu Trigger */}
          <MenuTrigger
            isOpen={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          />
        </Container>
      </header>

      {/* Fullscreen Navigation Overlay Foundation */}
      <NavigationOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
};
