import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { initSmoothScroll, type SmoothScrollController } from '@/animations/scroll/lenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SmoothScrollContextValue {
  controller: SmoothScrollController | null;
  scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  controller: null,
  scrollTo: () => {},
});

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reducedMotion = useReducedMotion();
  const [controller, setController] = useState<SmoothScrollController | null>(null);
  const controllerRef = useRef<SmoothScrollController | null>(null);

  useEffect(() => {
    const instance = initSmoothScroll({ reducedMotion });
    controllerRef.current = instance;
    setController(instance);

    return () => {
      instance.destroy();
      controllerRef.current = null;
    };
  }, [reducedMotion]);

  const scrollTo = (target: string | number | HTMLElement, options?: Record<string, unknown>) => {
    controllerRef.current?.scrollTo(target, options);
  };

  return (
    <SmoothScrollContext.Provider value={{ controller, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export function useLenisScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}
