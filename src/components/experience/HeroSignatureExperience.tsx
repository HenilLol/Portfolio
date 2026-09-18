import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useViewport } from '@/hooks/useViewport';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { HERO_CONTENT } from '@/data/heroContent';
import { Container } from '@/components/ui/layout/Container';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Button } from '@/components/ui/Button';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';

interface HeroSignatureExperienceProps {
  introComplete?: boolean;
}

export const HeroSignatureExperience: React.FC<HeroSignatureExperienceProps> = ({
  introComplete = true,
}) => {
  const reducedMotion = useReducedMotion();
  const { isDesktop, hasTouch } = useViewport();
  const { scrollTo } = useLenisScroll();

  const heroSectionRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const positioningRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);

  // Mouse repulsion state for letters
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isConstructed, setIsConstructed] = useState(false);

  // Construction Sequence via GSAP
  useEffect(() => {
    if (!introComplete || !heroSectionRef.current) return;

    if (reducedMotion) {
      setIsConstructed(true);
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial State
      gsap.set(
        [
          eyebrowRef.current,
          positioningRef.current,
          ctaGroupRef.current,
          metadataRef.current,
        ],
        { opacity: 0, y: 24 }
      );
      gsap.set('.hero-letter', {
        opacity: 0,
        y: 48,
        rotateX: -30,
      });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => setIsConstructed(true),
      });

      // Technical calibration eyebrow reveals
      tl.to(
        eyebrowRef.current,
        { opacity: 1, y: 0, duration: 0.6 }
      );

      // Monumental Name letterforms assemble with staggered kinetic entrance
      tl.to(
        '.hero-letter',
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.035,
          ease: 'back.out(1.4)',
        },
        '-=0.4'
      );

      // Positioning statement settles
      tl.to(
        positioningRef.current,
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      );

      // CTAs and metadata resolve
      tl.to(
        [ctaGroupRef.current, metadataRef.current],
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        '-=0.3'
      );

      // 2. Scroll Choreography: 5-Stage Spatial Evolution per Master Spec 5.1
      // 0–20%: Identity stabilizes
      // 20–40%: Typography begins separating from composition
      // 40–60%: Spatial perspective tilt activates
      // 60–80%: Letters and geometry occupy spatial depth
      // 80–100%: Entire composition compresses toward next scene
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      // Stage 20–40%: Typography separation and letter-spacing dilation
      scrollTl.to(nameContainerRef.current, {
        letterSpacing: '0.06em',
        y: -15,
        duration: 0.3,
        ease: 'power1.out',
      });

      // Stage 40–60%: 3D spatial rotation & perspective translation
      scrollTl.to(nameContainerRef.current, {
        rotateX: 14,
        scaleY: 0.94,
        y: -40,
        duration: 0.3,
        ease: 'power2.inOut',
      });

      // Stage 60–100%: Compression toward next scene
      scrollTl.to(nameContainerRef.current, {
        y: -80,
        scale: 0.9,
        opacity: 0.12,
        duration: 0.4,
        ease: 'power3.in',
      });

      // Synchronized fade and displacement for supporting positioning statement & CTAs
      scrollTl.to(
        [positioningRef.current, ctaGroupRef.current],
        {
          y: -50,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
        },
        0.2
      );
    }, heroSectionRef);

    return () => ctx.revert();
  }, [introComplete, reducedMotion]);

  // Mouse proximity tracker for letter repulsion
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isDesktop || hasTouch || reducedMotion || !isConstructed) return;
      setMousePos({ x: e.clientX, y: e.clientY });
    },
    [isDesktop, hasTouch, reducedMotion, isConstructed]
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: -1000, y: -1000 });
  }, []);

  // Split name for interactive physical typography
  const firstNameLetters = 'HENIL'.split('');
  const lastNameLetters = 'PATEL'.split('');

  return (
    <section
      ref={heroSectionRef}
      id="hero"
      data-section="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92dvh] sm:min-h-[95vh] flex flex-col justify-between pt-20 sm:pt-28 pb-10 sm:pb-12 overflow-hidden border-b border-border/70 select-none perspective-[1200px]"
    >
      {/* Subtle Atmospheric Light & Horizon Grid is handled globally by EnvironmentSystem */}

      {/* Main Hero Foreground */}
      <Container size="wide" className="relative z-10 my-auto w-full">
        <div ref={heroContentRef} className="max-w-5xl space-y-6 sm:space-y-8">
          {/* Eyebrow / System Initialization State */}
          <div ref={eyebrowRef} className={reducedMotion ? 'opacity-100' : 'opacity-0'}>
            <div className="flex items-center gap-3">
              <TechnicalLabel indicator indicatorColor="accent">
                {HERO_CONTENT.narrative.eyebrow}
              </TechnicalLabel>
              <span className="font-mono text-[10px] tracking-widest text-foreground-muted hidden sm:inline-block uppercase">
                SPEC // V2.0 ACTIVE
              </span>
            </div>
          </div>

          {/* Monumental Name with Interactive Kinetic Physics */}
          <div
            ref={nameContainerRef}
            className="transform-style-3d will-change-transform py-2"
          >
            {/* First Name Line: HENIL */}
            <div className="flex items-baseline flex-wrap overflow-visible leading-[0.88] tracking-tight">
              {firstNameLetters.map((char, index) => (
                <KineticLetter
                  key={`first-${index}`}
                  char={char}
                  mousePos={mousePos}
                  reducedMotion={reducedMotion}
                  isDesktop={isDesktop && !hasTouch}
                />
              ))}
            </div>

            {/* Last Name Line: PATEL */}
            <div className="flex items-baseline flex-wrap overflow-visible leading-[0.88] tracking-tight text-foreground-secondary/90 hover:text-foreground transition-colors duration-500">
              {lastNameLetters.map((char, index) => (
                <KineticLetter
                  key={`last-${index}`}
                  char={char}
                  mousePos={mousePos}
                  reducedMotion={reducedMotion}
                  isDesktop={isDesktop && !hasTouch}
                />
              ))}
            </div>
          </div>

          {/* Editorial Positioning Statement */}
          <p
            ref={positioningRef}
            className={`text-foreground-secondary text-base sm:text-lg md:text-xl font-normal max-w-2xl leading-relaxed ${
              reducedMotion ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {HERO_CONTENT.narrative.positioningStatement}
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div
            ref={ctaGroupRef}
            className={`pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto ${
              reducedMotion ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <InteractiveCursorTarget cursorType="explore" cursorLabel="EXPLORE">
              <Button
                variant="magnetic"
                onClick={() => scrollTo(HERO_CONTENT.actions.primaryCta.href)}
                className="w-full sm:w-auto bg-foreground text-background hover:bg-accent hover:text-background font-mono text-xs tracking-widest uppercase px-8 py-3.5 justify-center shadow-lg transition-all"
              >
                {HERO_CONTENT.actions.primaryCta.label}
              </Button>
            </InteractiveCursorTarget>

            <InteractiveCursorTarget cursorType="interactive">
              <Button
                variant="outline"
                onClick={() => scrollTo(HERO_CONTENT.actions.secondaryCta.href)}
                className="w-full sm:w-auto font-mono text-xs tracking-widest uppercase px-6 py-3.5 justify-center hover:border-accent/60"
              >
                {HERO_CONTENT.actions.secondaryCta.label} →
              </Button>
            </InteractiveCursorTarget>
          </div>
        </div>
      </Container>

      {/* Bottom Technical Telemetry Bar */}
      <Container size="wide" className="relative z-10 pt-8 sm:pt-12">
        <div
          ref={metadataRef}
          className={`border-t border-border/70 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 font-mono text-[10px] tracking-widest text-foreground-muted uppercase ${
            reducedMotion ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-foreground font-semibold">{HERO_CONTENT.identity.displayName}</span>
            <span className="text-border">/</span>
            <span>{HERO_CONTENT.identity.moniker}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>LOC // {HERO_CONTENT.identity.coordinates.location}</span>
            <span className="hidden md:inline-block">TIMEZONE // {HERO_CONTENT.identity.coordinates.timezone}</span>
            <div className="flex items-center gap-1.5 text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>{HERO_CONTENT.identity.status}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

/**
 * Individual kinetic letterform that physically calculates repulsion distance from cursor
 */
const KineticLetter: React.FC<{
  char: string;
  mousePos: { x: number; y: number };
  reducedMotion: boolean;
  isDesktop: boolean;
}> = ({ char, mousePos, reducedMotion, isDesktop }) => {
  const letterRef = useRef<HTMLSpanElement>(null);
  const [physics, setPhysics] = useState<{
    x: number;
    y: number;
    z: number;
    rotateX: number;
    rotateY: number;
    isNear: boolean;
  }>({ x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, isNear: false });

  useEffect(() => {
    if (!isDesktop || reducedMotion || !letterRef.current) {
      setPhysics({ x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, isNear: false });
      return;
    }

    const rect = letterRef.current.getBoundingClientRect();
    const letterCenterX = rect.left + rect.width / 2;
    const letterCenterY = rect.top + rect.height / 2;

    const dx = letterCenterX - mousePos.x;
    const dy = letterCenterY - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const threshold = 160; // 3D repulsion radius

    if (distance < threshold && distance > 0) {
      const normalizedDist = 1 - distance / threshold;
      const force = normalizedDist * 22; // up to 22px physical displacement
      const angle = Math.atan2(dy, dx);

      setPhysics({
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force,
        z: normalizedDist * 24,
        rotateY: -Math.cos(angle) * normalizedDist * 20,
        rotateX: Math.sin(angle) * normalizedDist * 16,
        isNear: distance < 90,
      });
    } else {
      setPhysics({ x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, isNear: false });
    }
  }, [mousePos, isDesktop, reducedMotion]);

  return (
    <motion.span
      ref={letterRef}
      animate={{
        x: physics.x,
        y: physics.y,
        z: physics.z,
        rotateX: physics.rotateX,
        rotateY: physics.rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 22,
        mass: 0.12,
      }}
      className={`hero-letter inline-block font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold uppercase select-none transition-colors duration-300 will-change-transform ${
        physics.isNear ? 'text-accent' : ''
      }`}
    >
      {char}
    </motion.span>
  );
};
