import React, { useState } from 'react';
import { Container } from '@/components/ui/layout/Container';
import { HeneoxyBoot } from './HeneoxyBoot';
import { HeneoxyOsNavBar } from './HeneoxyOsNavBar';
import { HeneoxyHero } from './HeneoxyHero';
import { HeneoxyThesis } from './HeneoxyThesis';
import { HeneoxyParadigm } from './HeneoxyParadigm';
import { HeneoxyArchitecture } from './HeneoxyArchitecture';
import { HeneoxySystemFlow } from './HeneoxySystemFlow';
import { HeneoxyKnowledgeAndSecurity } from './HeneoxyKnowledgeAndSecurity';
import { HeneoxyStatusAndStack } from './HeneoxyStatusAndStack';
import { HeneoxyRoadmap } from './HeneoxyRoadmap';

export const HeneoxyExperience: React.FC = () => {
  const [, setBootComplete] = useState<boolean>(false);

  return (
    <div className="relative w-full min-h-screen bg-[#05070B] text-foreground">
      {/* Cinematic Subsystem Boot Initialization */}
      <HeneoxyBoot onComplete={() => setBootComplete(true)} />

      {/* Immersive Persistent OS Navigation Bar */}
      <HeneoxyOsNavBar />

      {/* Main Flagship Canvas */}
      <Container size="wide" className="py-8 sm:py-14 lg:py-16 space-y-16 sm:space-y-24">
        <HeneoxyHero />
        <HeneoxyThesis />
        <HeneoxyParadigm />
        <HeneoxyArchitecture />
        <HeneoxySystemFlow />
        <HeneoxyKnowledgeAndSecurity />
        <HeneoxyStatusAndStack />
        <HeneoxyRoadmap />
      </Container>
    </div>
  );
};
