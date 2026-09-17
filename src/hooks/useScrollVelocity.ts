import { useEffect, useState, useRef } from 'react';
import { useLenisScroll } from './useLenisScroll';
import { useReducedMotion } from './useReducedMotion';

export interface ScrollVelocityState {
  velocity: number;
  normalizedVelocity: number;
  isScrolling: boolean;
  scrollProgress: number;
}

/**
 * Hook to read real-time scroll velocity and progress for environmental displacement and kinetic typography.
 */
export function useScrollVelocity(): ScrollVelocityState {
  const { controller } = useLenisScroll();
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<ScrollVelocityState>({
    velocity: 0,
    normalizedVelocity: 0,
    isScrolling: false,
    scrollProgress: 0,
  });

  const settleTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    if (controller?.lenis) {
      const lenis = controller.lenis;

      const handleScroll = (e: { velocity: number; progress: number }) => {
        const vel = e.velocity || 0;
        const norm = Math.min(Math.abs(vel) / 12, 1);

        setState({
          velocity: vel,
          normalizedVelocity: norm,
          isScrolling: Math.abs(vel) > 0.05,
          scrollProgress: e.progress || 0,
        });

        if (settleTimeoutRef.current) {
          window.clearTimeout(settleTimeoutRef.current);
        }

        settleTimeoutRef.current = window.setTimeout(() => {
          setState((prev) => ({
            ...prev,
            velocity: 0,
            normalizedVelocity: 0,
            isScrolling: false,
          }));
        }, 120);
      };

      lenis.on('scroll', handleScroll);

      return () => {
        lenis.off('scroll', handleScroll);
        if (settleTimeoutRef.current) {
          window.clearTimeout(settleTimeoutRef.current);
        }
      };
    } else {
      // Fallback window scroll listener
      let lastScrollTop = window.scrollY || 0;
      let lastTime = performance.now();

      const onWindowScroll = () => {
        const now = performance.now();
        const currentScrollTop = window.scrollY || 0;
        const dt = Math.max(now - lastTime, 16);
        const dy = currentScrollTop - lastScrollTop;
        const vel = (dy / dt) * 16;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(Math.max(currentScrollTop / docHeight, 0), 1) : 0;

        lastScrollTop = currentScrollTop;
        lastTime = now;

        setState({
          velocity: vel,
          normalizedVelocity: Math.min(Math.abs(vel) / 15, 1),
          isScrolling: true,
          scrollProgress: progress,
        });

        if (settleTimeoutRef.current) {
          window.clearTimeout(settleTimeoutRef.current);
        }

        settleTimeoutRef.current = window.setTimeout(() => {
          setState((prev) => ({
            ...prev,
            velocity: 0,
            normalizedVelocity: 0,
            isScrolling: false,
          }));
        }, 120);
      };

      window.addEventListener('scroll', onWindowScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', onWindowScroll);
        if (settleTimeoutRef.current) {
          window.clearTimeout(settleTimeoutRef.current);
        }
      };
    }
  }, [controller, reducedMotion]);

  return state;
}
