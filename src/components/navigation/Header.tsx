import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuTrigger } from './MenuTrigger';
import { NavigationOverlay } from './NavigationOverlay';
import { Container } from '@/components/ui/layout/Container';
import { useScrollspy } from '@/hooks/useScrollspy';

const NAV_SECTION_IDS = [
  'hero',
  'visual-engine',
  'about',
  'skills',
  'projects',
  'creative',
  'experience',
  'contact',
  'ending',
];

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Active section tracking via IntersectionObserver
  const activeSection = useScrollspy(NAV_SECTION_IDS);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
        <Container size="wide" className="h-full flex items-center justify-between">
          {/* Left: Minimal Editorial Brand */}
          <Link
            to="/"
            aria-label="Henil Studio Home"
            className="group flex items-center gap-2 font-editorial text-sm font-bold tracking-widest text-foreground uppercase hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent py-2 px-1"
          >
            <span>HENIL</span>
            <span className="text-foreground-muted font-mono text-xs font-normal">/</span>
            <span className="font-mono text-[10px] text-foreground-secondary tracking-widest uppercase group-hover:text-accent transition-colors">
              STUDIO
            </span>
          </Link>

          {/* Center (Desktop only): Minimal Technical Telemetry */}
          <div
            aria-hidden="true"
            className="hidden md:flex items-center gap-4 font-mono text-[10px] tracking-widest text-foreground-muted uppercase select-none"
          >
            <span className="text-accent">SYS // ACTIVE</span>
            <span className="text-border">/</span>
            {location.pathname === '/' ? (
              <span>LOC // #{activeSection.toUpperCase()}</span>
            ) : (
              <span className="text-foreground-secondary">{location.pathname.toUpperCase()}</span>
            )}
            <span className="text-border">/</span>
            <span>23.02°N 72.57°E</span>
          </div>

          {/* Right: Upgraded Menu Trigger */}
          <MenuTrigger
            ref={triggerRef}
            isOpen={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          />
        </Container>
      </header>

      {/* Fullscreen Navigation Overlay */}
      <NavigationOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeSection={activeSection}
        triggerRef={triggerRef}
      />
    </>
  );
};
