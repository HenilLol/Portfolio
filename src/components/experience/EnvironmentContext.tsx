import React, { createContext, useContext, useState, useEffect } from 'react';

export type ExperienceState =
  | 'DORMANT'
  | 'IDENTITY'
  | 'IDENTITY_BREAK'
  | 'CONSTELLATION'
  | 'TECH_NETWORK'
  | 'HENEOXY_ENTRY'
  | 'HENEOXY'
  | 'AEROINDEX'
  | 'COALINTEL'
  | 'BLUEPRINT'
  | 'CREATIVE'
  | 'JOURNEY'
  | 'CONTACT'
  | 'SHUTDOWN';

interface EnvironmentContextType {
  currentSection: string;
  setCurrentSection: (sec: string) => void;
  activeDimension: string | null;
  setActiveDimension: (dim: string | null) => void;
  isHeneoxyTakeover: boolean;
  setHeneoxyTakeover: (active: boolean) => void;
  worldProgress: number;
  experienceState: ExperienceState;
}

const EnvironmentContext = createContext<EnvironmentContextType>({
  currentSection: 'hero',
  setCurrentSection: () => {},
  activeDimension: null,
  setActiveDimension: () => {},
  isHeneoxyTakeover: false,
  setHeneoxyTakeover: () => {},
  worldProgress: 0,
  experienceState: 'IDENTITY',
});

export const EnvironmentProvider: React.FC<{
  currentSection: string;
  children: React.ReactNode;
}> = ({ currentSection: initialSection, children }) => {
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [activeDimension, setActiveDimension] = useState<string | null>(null);
  const [isHeneoxyTakeover, setHeneoxyTakeover] = useState<boolean>(false);
  const [worldProgress, setWorldProgress] = useState<number>(0);

  // Sync initialSection whenever prop changes
  useEffect(() => {
    if (initialSection) {
      setCurrentSection(initialSection);
    }
  }, [initialSection]);

  // Continuous worldProgress tracking driven by scroll timeline
  useEffect(() => {
    let animFrameId: number;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      setWorldProgress(progress);
    };

    const onScrollLoop = () => {
      handleScroll();
      animFrameId = requestAnimationFrame(onScrollLoop);
    };

    animFrameId = requestAnimationFrame(onScrollLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  // Compute conceptual ExperienceState from continuous progress
  const experienceState: ExperienceState = React.useMemo(() => {
    if (worldProgress < 0.04) return 'IDENTITY';
    if (worldProgress < 0.14) return 'IDENTITY_BREAK';
    if (worldProgress < 0.28) return 'CONSTELLATION';
    if (worldProgress < 0.42) return 'TECH_NETWORK';
    if (worldProgress < 0.54) return 'HENEOXY_ENTRY';
    if (worldProgress < 0.64) return 'HENEOXY';
    if (worldProgress < 0.74) return 'AEROINDEX';
    if (worldProgress < 0.82) return 'COALINTEL';
    if (worldProgress < 0.88) return 'BLUEPRINT';
    if (worldProgress < 0.94) return 'CREATIVE';
    if (worldProgress < 0.97) return 'JOURNEY';
    if (worldProgress < 0.99) return 'CONTACT';
    return 'SHUTDOWN';
  }, [worldProgress]);

  return (
    <EnvironmentContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        activeDimension,
        setActiveDimension,
        isHeneoxyTakeover,
        setHeneoxyTakeover,
        worldProgress,
        experienceState,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => useContext(EnvironmentContext);
