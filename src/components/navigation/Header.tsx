import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuTrigger } from './MenuTrigger';
import { NavigationOverlay } from './NavigationOverlay';
import { Container } from '@/components/ui/layout/Container';
import { useScrollspy } from '@/hooks/useScrollspy';
import { soundEngine } from '@/lib/sound';

const NAV_SECTION_IDS = [
  'hero',
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
  const [soundActive, setSoundActive] = useState(() => soundEngine.isEnabled());
  const [inOpening, setInOpening] = useState(true);
  const location = useLocation();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Active section tracking via IntersectionObserver
  const activeSection = useScrollspy(NAV_SECTION_IDS);

  // Hide header during the opening sequence on the homepage (below ~250vh it reveals)
  React.useEffect(() => {
    if (location.pathname !== '/') {
      setInOpening(false);
      return;
    }

    const onScroll = () => {
      const threshold = window.innerHeight * 2.6;
      setInOpening(window.scrollY < threshold);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const isHidden = location.pathname === '/' && inOpening && !menuOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/80 bg-background/90 backdrop-blur-md transition-all duration-500 ${
          isHidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
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
            <span>INDIA · IST</span>
          </div>

          {/* Right: Sound Toggle + Menu Trigger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSoundActive(soundEngine.toggle())}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-border/80 hover:border-accent font-mono text-[9px] uppercase tracking-widest text-foreground-muted hover:text-accent transition-colors cursor-pointer"
              title="Toggle Experience Sound"
              aria-label={soundActive ? 'Mute Sound' : 'Enable Sound'}
            >
              <span className={soundActive ? 'text-accent animate-pulse' : 'text-foreground-muted'}>
                {soundActive ? '●' : '○'}
              </span>
              <span>AUDIO // {soundActive ? 'ON' : 'OFF'}</span>
            </button>

            <MenuTrigger
              ref={triggerRef}
              isOpen={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            />
          </div>
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
