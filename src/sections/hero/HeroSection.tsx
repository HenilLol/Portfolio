import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { HERO_CONTENT } from '@/data/heroContent';
import { LazyHeroScene } from '@/components/3d/LazyHeroScene';
import { Container } from '@/components/ui/layout/Container';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Button } from '@/components/ui/Button';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';
import { GSAP_EASING, DURATION } from '@/animations/presets/motionTokens';

export interface HeroSectionProps {
  introComplete?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ introComplete = true }) => {
  const reducedMotion = useReducedMotion();
  const { scrollTo } = useLenisScroll();

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headline1Ref = useRef<HTMLDivElement>(null);
  const headline2Ref = useRef<HTMLDivElement>(null);
  const positioningRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!introComplete || !sectionRef.current) return;

    if (reducedMotion) {
      // If reduced motion is requested, immediately ensure everything is visible without transitions
      const elements = [
        eyebrowRef.current,
        headline1Ref.current,
        headline2Ref.current,
        positioningRef.current,
        ctaGroupRef.current,
        metadataRef.current,
        canvasWrapperRef.current,
      ];
      elements.forEach((el) => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.clipPath = 'none';
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial state setup
      gsap.set(
        [
          eyebrowRef.current,
          positioningRef.current,
          ctaGroupRef.current,
          metadataRef.current,
        ],
        { opacity: 0, y: 16 }
      );
      gsap.set([headline1Ref.current, headline2Ref.current], {
        opacity: 0,
        y: 28,
        clipPath: 'inset(100% 0% 0% 0%)',
      });
      gsap.set(canvasWrapperRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: GSAP_EASING.editorial },
      });

      // 1. Subtle 3D background atmosphere begins resolving
      tl.to(canvasWrapperRef.current, {
        opacity: 1,
        duration: DURATION.SLOW,
      });

      // 2. Eyebrow enters
      tl.to(
        eyebrowRef.current,
        {
          opacity: 1,
          y: 0,
          duration: DURATION.MEDIUM,
        },
        '-=0.6'
      );

      // 3. Primary headline reveals with clip-path mask
      tl.to(
        headline1Ref.current,
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: DURATION.MEDIUM + 0.2,
        },
        '-=0.4'
      );

      // 4. Secondary headline resolves
      tl.to(
        headline2Ref.current,
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: DURATION.MEDIUM + 0.2,
        },
        '-=0.5'
      );

      // 5. Positioning statement settles
      tl.to(
        positioningRef.current,
        {
          opacity: 1,
          y: 0,
          duration: DURATION.MEDIUM,
        },
        '-=0.4'
      );

      // 6. Action CTAs emerge
      tl.to(
        ctaGroupRef.current,
        {
          opacity: 1,
          y: 0,
          duration: DURATION.FAST + 0.2,
        },
        '-=0.3'
      );

      // 7. Bottom metadata coordinates resolve
      tl.to(
        metadataRef.current,
        {
          opacity: 1,
          y: 0,
          duration: DURATION.FAST + 0.2,
        },
        '-=0.2'
      );

      // ScrollTrigger: Seamless recession into the next section as user scrolls down
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: -50,
        opacity: 0.15,
        ease: 'none',
      });

      gsap.to(canvasWrapperRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        scale: 0.88,
        opacity: 0.25,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [introComplete, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-section="hero"
      className="relative min-h-[90dvh] sm:min-h-[92vh] flex flex-col justify-between pt-20 sm:pt-28 pb-10 sm:pb-12 overflow-hidden border-b border-border"
    >
      {/* Three.js 3D Spatial Atmosphere Layer (Quiet Background Depth) */}
      <div
        ref={canvasWrapperRef}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ opacity: 0 }}
      >
        <LazyHeroScene pointerSensitivity={0.35} />
      </div>

      {/* Main Hero Foreground Content */}
      <Container size="wide" className="relative z-10 my-auto">
        <div ref={contentRef} className="max-w-5xl space-y-6 sm:space-y-8">
          {/* Eyebrow / Technical Specification */}
          <div ref={eyebrowRef} className="opacity-0">
            <TechnicalLabel indicator indicatorColor="accent">
              {HERO_CONTENT.narrative.eyebrow}
            </TechnicalLabel>
          </div>

          {/* Large Identity / Headlines with Negative Space */}
          <div className="space-y-2 sm:space-y-3">
            <div ref={headline1Ref} className="opacity-0 overflow-hidden">
              <DisplayText as="h1" size="2xl" className="text-foreground">
                {HERO_CONTENT.narrative.headlinePrimary}
              </DisplayText>
            </div>
            <div ref={headline2Ref} className="opacity-0 overflow-hidden">
              <DisplayText as="h2" size="xl" className="text-foreground-secondary font-normal">
                {HERO_CONTENT.narrative.headlineSecondary}
              </DisplayText>
            </div>
          </div>

          {/* Positioning Statement */}
          <p
            ref={positioningRef}
            className="text-foreground-secondary text-base sm:text-lg md:text-xl font-normal max-w-2xl leading-relaxed opacity-0"
          >
            {HERO_CONTENT.narrative.positioningStatement}
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div
            ref={ctaGroupRef}
            className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 opacity-0 w-full sm:w-auto"
          >
            <InteractiveCursorTarget cursorType="interactive">
              <Button
                variant="magnetic"
                onClick={() => scrollTo(HERO_CONTENT.actions.primaryCta.href)}
                className="w-full sm:w-auto bg-foreground text-background hover:bg-accent hover:text-background font-medium px-8 py-3.5 justify-center"
              >
                {HERO_CONTENT.actions.primaryCta.label}
              </Button>
            </InteractiveCursorTarget>

            <InteractiveCursorTarget cursorType="interactive">
              <Button
                variant="outline"
                onClick={() => scrollTo(HERO_CONTENT.actions.secondaryCta.href)}
                className="w-full sm:w-auto px-6 py-3.5 justify-center"
              >
                {HERO_CONTENT.actions.secondaryCta.label} →
              </Button>
            </InteractiveCursorTarget>
          </div>
        </div>
      </Container>

      {/* Bottom Architectural Metadata Bar */}
      <Container size="wide" className="relative z-10 pt-8 sm:pt-12">
        <div
          ref={metadataRef}
          className="border-t border-border-subtle pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 font-mono text-[10px] tracking-widest text-foreground-muted uppercase opacity-0"
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
              <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
              <span>{HERO_CONTENT.identity.status}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
