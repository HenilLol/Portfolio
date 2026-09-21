import React from 'react';
import { CinematicOpeningExperience } from '@/components/experience/CinematicOpeningExperience';

export interface HeroSectionProps {
  introComplete?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return <CinematicOpeningExperience />;
};
