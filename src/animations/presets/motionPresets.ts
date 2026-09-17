/**
 * Motion for React (UI & component level) reusable transition presets
 */

export const editorialEase = [0.16, 1, 0.3, 1] as const;

export const transitionSpring = {
  snappy: { type: 'spring' as const, stiffness: 350, damping: 25 },
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  editorial: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitionSpring.editorial },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: transitionSpring.editorial },
  exit: { opacity: 0, y: 16, transition: { duration: 0.25 } },
};

export const fadeScale = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: transitionSpring.snappy },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

export const staggerContainer = (staggerMs = 0.08, delayMs = 0) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerMs,
      delayChildren: delayMs,
    },
  },
});

export const clipReveal = {
  initial: { clipPath: 'inset(100% 0% 0% 0%)' },
  animate: { clipPath: 'inset(0% 0% 0% 0%)', transition: transitionSpring.editorial },
  exit: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.3 } },
};
