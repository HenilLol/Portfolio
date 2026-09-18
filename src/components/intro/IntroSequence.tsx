import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { HERO_CONTENT } from '@/data/heroContent';
import { GSAP_EASING } from '@/animations/presets/motionTokens';
import { soundEngine } from '@/lib/sound';

export interface IntroSequenceProps {
  onComplete: () => void;
}

const BOOT_STAGES = [
  'INITIALIZING',
  'ENVIRONMENT',
  'GEOMETRY',
  'IDENTITY',
  'SIGNAL ACTIVE',
];

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(true);
  const [bootStageIndex, setBootStageIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const distantLightRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stageLabelRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  // Generate subtle converging star dust particles
  const particleCount = 42;
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 600,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  useEffect(() => {
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

      // Stage 1: DORMANT marker appears
      tl.fromTo(
        markerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' }
      );

      // Stage 2: Distant light point activates
      tl.fromTo(
        distantLightRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          onStart: () => soundEngine.playClick(),
        },
        '-=0.2'
      );

      // Stage 3: Boot sequence stages progression
      BOOT_STAGES.forEach((_stage, idx) => {
        tl.call(() => {
          setBootStageIndex(idx);
          if (idx % 2 === 0) soundEngine.playClick();
        });
        tl.to({}, { duration: 0.28 });
      });

      // Stage 4: Particles converge toward center
      tl.to('.intro-particle', {
        x: 0,
        y: 0,
        opacity: 0.9,
        duration: 0.9,
        stagger: {
          each: 0.015,
          from: 'random',
        },
        ease: 'power3.inOut',
      }, '-=0.5');

      // Stage 5: Distant light expands into central burst
      tl.to(distantLightRef.current, {
        scale: 24,
        opacity: 0.12,
        duration: 0.7,
        ease: 'power2.inOut',
      }, '-=0.4');

      // Stage 6: Name constructs from converging energy
      tl.fromTo(
        titleRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 20 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: GSAP_EASING.editorial,
        },
        '-=0.3'
      );

      // Brief hold for cinematic apprehension
      tl.to({}, { duration: 0.45 });

      // Stage 7: Upward curtain wipe into full interactive world
      tl.to(container, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.85,
        ease: GSAP_EASING.editorial,
      });
    }, container);

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
      aria-label="Scene 00 Initialization Sequence"
      className="fixed inset-0 z-50 bg-[#060709] text-foreground flex flex-col justify-between p-6 sm:p-12 select-none cursor-pointer overflow-hidden"
      onClick={() => {
        sessionStorage.setItem('hp_intro_completed', 'true');
        setActive(false);
        onComplete();
      }}
    >
      {/* Top Header Marker: ENVIRONMENT // DORMANT */}
      <div ref={markerRef} className="flex items-center justify-between font-mono text-[10px] tracking-widest text-foreground-muted uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span className="text-foreground">ENVIRONMENT // DORMANT</span>
        </div>
        <span className="text-accent tracking-widest hidden sm:inline-block">
          STATE // {BOOT_STAGES[bootStageIndex]}
        </span>
      </div>

      {/* Center: Distant Light Point & Converging Particles */}
      <div className="relative my-auto max-w-4xl mx-auto w-full text-center flex flex-col items-center justify-center">
        {/* Distant Light Point */}
        <div
          ref={distantLightRef}
          className="w-3 h-3 rounded-full bg-accent shadow-[0_0_30px_#00F0FF] mb-6 pointer-events-none"
        />

        {/* Converging Dust Particles */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {particles.map((p) => (
            <span
              key={p.id}
              className="intro-particle absolute rounded-full bg-accent/80"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                transform: `translate(${p.x}px, ${p.y}px)`,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>

        {/* Dynamic Boot Stage Subtitle */}
        <div
          ref={stageLabelRef}
          className="font-mono text-[11px] text-accent tracking-[0.25em] uppercase mb-4"
        >
          [ {BOOT_STAGES[bootStageIndex]} ]
        </div>

        {/* Assembled Name */}
        <h1
          ref={titleRef}
          className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tightest text-foreground opacity-0"
        >
          {HERO_CONTENT.identity.displayName}
        </h1>

        <div className="w-16 h-[1px] bg-accent/50 mt-4 origin-center" />
      </div>

      {/* Bottom Hint */}
      <div className="flex items-center justify-between font-mono text-[9px] tracking-widest text-foreground-muted uppercase">
        <span>ARCHITECTURAL PORTFOLIO SPEC V3.0</span>
        <span className="hover:text-foreground transition-colors">
          [TAP OR ESCAPE TO INITIALIZE IMMEDIATELY]
        </span>
      </div>
    </div>
  );
};
