import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins centrally
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Configure high-performance defaults
  gsap.defaults({
    ease: 'power3.out',
    duration: 0.8,
  });

  // Optimize ScrollTrigger refresh
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
  });
}

export { gsap, ScrollTrigger };
