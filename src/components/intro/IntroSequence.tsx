import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { HERO_CONTENT } from '@/data/heroContent';
import { GSAP_EASING } from '@/animations/presets/motionTokens';

export interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If user prefers reduced motion or already completed intro in current session, skip immediately
    const hasSeenIntro = sessionStorage.getItem('hp_intro_completed');
    if (reducedMotion || hasSeenIntro === 'true') {
      setActive(false);
      onComplete();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('hp_intro_completed', 'true');
          setActive(false);
          onComplete();
        },
      });

      // 1. Technical coordinate stamp enters
      tl.fromTo(
        coordRef.current,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );

      // 2. Center hairline expands horizontally
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: GSAP_EASING.editorial },
        '-=0.2'
      );

      // 3. Name reveals through clip-path mask
      tl.fromTo(
        titleRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 16 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: GSAP_EASING.editorial,
        },
        '-=0.4'
      );

      // 4. Subtle status badge lights up
      tl.fromTo(
        statusRef.current,
        { opacity: 0, letterSpacing: '0.1em' },
        { opacity: 1, letterSpacing: '0.22em', duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );

      // 5. Short pause for visual apprehension
      tl.to({}, { duration: 0.5 });

      // 6. Cinematic upward curtain wipe into the page
      tl.to(container, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.85,
        ease: GSAP_EASING.editorial,
      });
    }, container);

    // Allow user to immediately skip on keypress or click
    const handleSkip = () => {
      ctx.revert();
      sessionStorage.setItem('hp_intro_completed', 'true');
      setActive(false);
      onComplete();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Escape', ' ', 'Enter'].includes(e.key)) {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      ctx.revert();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reducedMotion, onComplete]);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="System Identity Boot Sequence"
      className="fixed inset-0 z-50 bg-background text-foreground flex flex-col justify-between p-4 sm:p-12 lg:p-16 select-none cursor-pointer"
      onClick={() => {
        sessionStorage.setItem('hp_intro_completed', 'true');
        setActive(false);
        onComplete();
      }}
    >
      {/* Top Technical Metadata */}
      <div ref={coordRef} className="flex items-center justify-between font-mono text-[10px] tracking-widest text-foreground-muted uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>INITIALIZING ENVIRONMENT</span>
        </div>
        <span className="hidden sm:inline-block">
          {HERO_CONTENT.identity.coordinates.lat} // {HERO_CONTENT.identity.coordinates.lon}
        </span>
        <span className="sm:hidden">
          {HERO_CONTENT.identity.coordinates.region}
        </span>
      </div>

      {/* Centerpiece Identity Reveal */}
      <div className="my-auto max-w-4xl mx-auto w-full text-center space-y-4 px-2">
        <span
          ref={statusRef}
          className="font-mono text-[10px] text-accent tracking-widest uppercase block opacity-0"
        >
          {HERO_CONTENT.identity.moniker}
        </span>

        <h1
          ref={titleRef}
          className="font-editorial text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tightest text-foreground opacity-0"
        >
          {HERO_CONTENT.identity.displayName}
        </h1>

        <div
          ref={lineRef}
          className="w-24 h-[1px] bg-accent/40 mx-auto origin-center"
        />
      </div>

      {/* Bottom Hint */}
      <div className="flex items-center justify-between font-mono text-[9px] tracking-widest text-foreground-muted uppercase">
        <span>PHASE 2 // CINEMATIC INTEGRATION</span>
        <span className="hover:text-foreground transition-colors">
          [TAP ANYWHERE OR PRESS ESC TO SKIP]
        </span>
      </div>
    </div>
  );
};
