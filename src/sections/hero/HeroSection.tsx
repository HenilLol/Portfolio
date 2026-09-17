import React from 'react';
import { HeroSignatureExperience } from '@/components/experience/HeroSignatureExperience';

export interface HeroSectionProps {
  introComplete?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ introComplete = true }) => {
  return <HeroSignatureExperience introComplete={introComplete} />;
};
