/**
 * Animation System Types
 */

export interface TransitionPreset {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: {
    duration?: number;
    ease?: number[] | string;
    delay?: number;
    staggerChildren?: number;
    delayChildren?: number;
  };
}

export interface ScrollTriggerConfig {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  anticipatePin?: number;
}
