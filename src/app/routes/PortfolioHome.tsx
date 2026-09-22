import React, { useState } from 'react';
import { Header } from '@/components/navigation/Header';
import { PageTransition } from '@/components/transitions/PageTransition';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { IntroSequence } from '@/components/intro/IntroSequence';
import { GrainLayer } from '@/components/ui/atmosphere/GrainLayer';
import { GridOverlay } from '@/components/ui/layout/GridOverlay';
import { EnvironmentSystem } from '@/components/experience/EnvironmentSystem';
import { EnvironmentProvider } from '@/components/experience/EnvironmentContext';
import { HeroSection } from '@/sections/hero/HeroSection';
import { AboutSection } from '@/sections/about/AboutSection';
import { SkillsSection } from '@/sections/skills/SkillsSection';
import { ProjectsSection } from '@/sections/projects/ProjectsSection';
import { CreativeSection } from '@/sections/creative/CreativeSection';
import { ExperienceSection } from '@/sections/experience/ExperienceSection';
import { ContactSection } from '@/sections/contact/ContactSection';
import { EndingSection } from '@/sections/ending/EndingSection';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { useScrollspy } from '@/hooks/useScrollspy';

const SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'projects',
  'creative',
  'experience',
  'contact',
  'ending',
];

export const PortfolioHome: React.FC = () => {
  const [introKey, setIntroKey] = useState<number>(0);
  const [introComplete, setIntroComplete] = useState<boolean>(false);
  const { scrollTo } = useLenisScroll();
  const activeSection = useScrollspy(SECTION_IDS);

  const handleRestartExperience = React.useCallback(() => {
    sessionStorage.removeItem('hp_intro_completed');
    setIntroComplete(false);
    setIntroKey((prev) => prev + 1);
    window.scrollTo(0, 0);
    scrollTo(0, { immediate: true });
  }, [scrollTo]);

  // Smooth scroll to URL hash if navigated from another route or directly with anchor
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      const timer = setTimeout(() => {
        scrollTo(hash, { offset: -64, duration: 1.2 });
      }, introComplete ? 150 : 500);
      return () => clearTimeout(timer);
    }
  }, [introComplete, scrollTo]);

  return (
    <EnvironmentProvider currentSection={activeSection}>
      <div className="min-h-screen bg-background text-foreground relative">
        {/* Scene 00: Dormant / Environmental Boot Initialization */}
        <IntroSequence key={introKey} onComplete={() => setIntroComplete(true)} />

        {/* Atmospheric & Structural Persistent Experience Layers */}
        <GrainLayer />
        <GridOverlay />
        <EnvironmentSystem currentSection={activeSection} />
        <CustomCursor />
        <Header />

        <PageTransition withTopPadding={false}>
          {/* Scene 01: Full-Viewport Hero with Kinetic Typography Physics & 5-Stage Scroll Choreography */}
          <HeroSection introComplete={introComplete} />

          {/* Continuous Architectural Flow — Edge-to-Edge Spatial Worlds */}
          <main className="relative z-10 w-full flex flex-col">
            {/* Scene 02: Who is Henil? // Spatial Identity Matrix */}
            <AboutSection />

            {/* Scene 03: Living Technology Constellation */}
            <SkillsSection />

            {/* Scene 04 & 05: Project Universe with Continuous World Morphing */}
            <ProjectsSection />

            {/* Scene 07: Creative Lab // Kinetic Filmstrip Archive */}
            <CreativeSection />

            {/* Scene 08: Spatial Journey & Evolution Map */}
            <ExperienceSection />

            {/* Scene 09: Minimal Transmission // Contact Protocol */}
            <ContactSection />
          </main>

          {/* Scene 10 & 11: System Disconnect Sequence & Reinitialize */}
          <EndingSection onRestartExperience={handleRestartExperience} />
        </PageTransition>
      </div>
    </EnvironmentProvider>
  );
};
