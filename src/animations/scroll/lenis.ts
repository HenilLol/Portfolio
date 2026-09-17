import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export interface SmoothScrollController {
  lenis: Lenis | null;
  destroy: () => void;
  scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void;
}

/**
 * Initializes Lenis smooth scrolling and synchronizes it with GSAP's RAF ticker and ScrollTrigger.
 */
export function initSmoothScroll(options?: { reducedMotion?: boolean }): SmoothScrollController {
  if (typeof window === 'undefined') {
    return {
      lenis: null,
      destroy: () => {},
      scrollTo: () => {},
    };
  }

  // If user requests reduced motion, bypass smooth inertia scrolling
  if (options?.reducedMotion) {
    return {
      lenis: null,
      destroy: () => {},
      scrollTo: (target) => {
        if (typeof target === 'string') {
          const el = document.querySelector(target);
          el?.scrollIntoView({ behavior: 'auto' });
        } else if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'auto' });
        } else if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: 'auto' });
        }
      },
    };
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
  });

  // Synchronize Lenis scroll updates with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Drive Lenis from GSAP's unified ticker to eliminate dual RAF overhead
  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  const destroy = () => {
    gsap.ticker.remove(tickerCallback);
    lenis.destroy();
  };

  const scrollTo = (target: string | number | HTMLElement, opts?: Record<string, unknown>) => {
    lenis.scrollTo(target, opts);
  };

  return {
    lenis,
    destroy,
    scrollTo,
  };
}
