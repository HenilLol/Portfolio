import { gsap } from '@/lib/gsap';

/**
 * Creates a clean GSAP timeline with standardized defaults and auto-cleanup support.
 */
export function createTimeline(vars?: gsap.TimelineVars): gsap.core.Timeline {
  return gsap.timeline({
    defaults: {
      ease: 'power3.out',
      duration: 0.8,
    },
    ...vars,
  });
}

/**
 * Kills all active ScrollTriggers safely, e.g. upon unmounting or route transition.
 */
export function cleanupScrollTriggers(): void {
  if (typeof window !== 'undefined') {
    import('@/lib/gsap').then(({ ScrollTrigger }) => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    });
  }
}
