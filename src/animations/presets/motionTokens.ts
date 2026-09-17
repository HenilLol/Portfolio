/**
 * Global Motion Tokens & Presets
 * Standardized timings, easing curves, and spring physics.
 */

export const DURATION = {
  FAST: 0.25,       // 250ms - micro interactions, toggles
  MEDIUM: 0.6,      // 600ms - card transitions, reveals
  SLOW: 1.1,        // 1100ms - layout transformations
  CINEMATIC: 2.2,   // 2200ms - atmospheric intro, section transitions
} as const;

export const EASING = {
  editorial: [0.16, 1, 0.3, 1] as const,
  smooth: [0.25, 0.1, 0.25, 1.0] as const,
  snappy: [0.4, 0, 0.2, 1] as const,
  outExpo: [0.19, 1, 0.22, 1] as const,
} as const;

export const SPRINGS = {
  snappy: { type: 'spring' as const, stiffness: 400, damping: 30 },
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  magnetic: { type: 'spring' as const, stiffness: 350, damping: 25, mass: 0.15 },
} as const;

export const TRANSITIONS = {
  fast: { duration: DURATION.FAST, ease: EASING.editorial },
  medium: { duration: DURATION.MEDIUM, ease: EASING.editorial },
  slow: { duration: DURATION.SLOW, ease: EASING.editorial },
  cinematic: { duration: DURATION.CINEMATIC, ease: EASING.editorial },
} as const;
