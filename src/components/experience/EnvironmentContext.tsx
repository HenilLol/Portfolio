import React, { createContext, useContext, useState } from 'react';

interface EnvironmentContextType {
  currentSection: string;
  setCurrentSection: (sec: string) => void;
  activeDimension: string | null;
  setActiveDimension: (dim: string | null) => void;
  isHeneoxyTakeover: boolean;
  setHeneoxyTakeover: (active: boolean) => void;
}

const EnvironmentContext = createContext<EnvironmentContextType>({
  currentSection: 'hero',
  setCurrentSection: () => {},
  activeDimension: null,
  setActiveDimension: () => {},
  isHeneoxyTakeover: false,
  setHeneoxyTakeover: () => {},
});

export const EnvironmentProvider: React.FC<{
  currentSection: string;
  children: React.ReactNode;
}> = ({ currentSection: initialSection, children }) => {
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [activeDimension, setActiveDimension] = useState<string | null>(null);
  const [isHeneoxyTakeover, setHeneoxyTakeover] = useState<boolean>(false);

  // Sync initialSection whenever prop changes
  React.useEffect(() => {
    if (initialSection) {
      setCurrentSection(initialSection);
    }
  }, [initialSection]);

  return (
    <EnvironmentContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        activeDimension,
        setActiveDimension,
        isHeneoxyTakeover,
        setHeneoxyTakeover,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => useContext(EnvironmentContext);
