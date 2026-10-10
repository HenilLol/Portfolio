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

    // Deep links: on load (or hash change), scroll to the #section target through
    // the Lenis controller. Browsers won't jump because Lenis owns scrolling;
    // without this, /#projects lands at the top and silently drops the hash.
    const scrollToHash = (hash: string) => {
      const id = hash.replace(/^#/, '');
      if (!id) return;
      // wait for layout (fonts/sections) to settle before measuring targets
      const attempt = (remaining: number) => {
        const el = document.getElementById(id);
        if (el) {
          instance.scrollTo(el, { offset: -80, duration: reducedMotion ? 0 : 1.4 });
        } else if (remaining > 0) {
          window.setTimeout(() => attempt(remaining - 1), 100);
        }
      };
      attempt(20); // retry up to ~2s for lazily-mounted sections
    };

    if (window.location.hash) {
      scrollToHash(window.location.hash);
    }
    const onHashChange = () => scrollToHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
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
