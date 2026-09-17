import React, { useState } from 'react';
import { Container } from '@/components/ui/layout/Container';
import { HeneoxyBoot } from './HeneoxyBoot';
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
    <>
      {/* Cinematic Subsystem Boot Initialization */}
      <HeneoxyBoot onComplete={() => setBootComplete(true)} />

      {/* Main Flagship Canvas */}
      <Container size="wide" className="py-12 sm:py-16 lg:py-20 space-y-16 sm:space-y-24">
        <HeneoxyHero />
        <HeneoxyThesis />
        <HeneoxyParadigm />
        <HeneoxyArchitecture />
        <HeneoxySystemFlow />
        <HeneoxyKnowledgeAndSecurity />
        <HeneoxyStatusAndStack />
        <HeneoxyRoadmap />
      </Container>
    </>
  );
};
