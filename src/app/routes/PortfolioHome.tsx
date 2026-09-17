import React, { useState } from 'react';
import { Header } from '@/components/navigation/Header';
import { PageTransition } from '@/components/transitions/PageTransition';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { IntroSequence } from '@/components/intro/IntroSequence';
import { GrainLayer } from '@/components/ui/atmosphere/GrainLayer';
import { GridOverlay } from '@/components/ui/layout/GridOverlay';
import { Container } from '@/components/ui/layout/Container';
import { EnvironmentSystem } from '@/components/experience/EnvironmentSystem';
import { HeroSection } from '@/sections/hero/HeroSection';
import { IntroSection } from '@/sections/intro/IntroSection';
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
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Cinematic Opening Sequence */}
      <IntroSequence key={introKey} onComplete={() => setIntroComplete(true)} />

      {/* Atmospheric & Structural Experience Layers */}
      <GrainLayer />
      <GridOverlay />
      <EnvironmentSystem currentSection={activeSection} />
      <CustomCursor />
      <Header />

      <PageTransition>
        {/* Full-Viewport Hero Experience with Kinetic Letterforms & Scroll Choreography */}
        <HeroSection introComplete={introComplete} />

        {/* Continuous Architectural Narrative Flow */}
        <Container size="wide" className="space-y-16 sm:space-y-24 pt-12 sm:pt-20">
          <IntroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <CreativeSection />
          <ExperienceSection />
          <ContactSection />
        </Container>

        {/* Final Cinematic Ending Scene with System Collapse & Reboot Loop */}
        <EndingSection onRestartExperience={handleRestartExperience} />
      </PageTransition>
    </div>
  );
};
