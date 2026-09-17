import React from 'react';
import { FinalEndingScene } from '@/components/ending/FinalEndingScene';

interface EndingSectionProps {
  onRestartExperience?: () => void;
}

export const EndingSection: React.FC<EndingSectionProps> = ({ onRestartExperience }) => {
  return <FinalEndingScene onRestartExperience={onRestartExperience} />;
};
