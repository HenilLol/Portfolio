import { useState, useEffect } from 'react';
import { prefersReducedMotion } from '@/animations/utils/reducedMotion';

/**
 * Hook to reactively track user's reduced-motion preference.
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(prefersReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(mediaQuery.matches);

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return reducedMotion;
}
