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
 * Hook to read real-time scroll velocity and progress for environmental
 * displacement and kinetic typography.
 *
 * Performance contract: scroll events fire faster than frames. All writes
 * go into a ref and are flushed to React state at most once per animation
 * frame via requestAnimationFrame coalescing — and only when a value
 * materially changed (velocity is bucketed to 2 decimal places) so
 * consumers re-render sparingly.
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

  // Pending values gathered from scroll events; flushed once per frame
  const pendingRef = useRef<ScrollVelocityState | null>(null);
  const rafRef = useRef<number | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);

  const flush = () => {
    rafRef.current = null;
    const pending = pendingRef.current;
    if (!pending) return;
    pendingRef.current = null;
    setState((prev) => {
      // Bucket the velocity so near-identical values don't re-render consumers
      const bucket = (v: number) => Math.round(v * 50) / 50;
      if (
        bucket(prev.normalizedVelocity) === bucket(pending.normalizedVelocity) &&
        prev.isScrolling === pending.isScrolling &&
        Math.abs(prev.scrollProgress - pending.scrollProgress) < 0.0005
      ) {
        return prev; // no material change — bail out, React skips the render
      }
      return pending;
    });
  };

  const queueUpdate = (next: ScrollVelocityState) => {
    pendingRef.current = next;
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(flush);
    }
  };

  useEffect(() => {
    if (reducedMotion) return;

    const cleanupRaf = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (settleTimeoutRef.current) {
        window.clearTimeout(settleTimeoutRef.current);
        settleTimeoutRef.current = null;
      }
    };

    if (controller?.lenis) {
      const lenis = controller.lenis;
      let lastProgress = 0;

      const handleScroll = (e: { velocity: number; progress: number }) => {
        const vel = e.velocity || 0;
        const norm = Math.min(Math.abs(vel) / 12, 1);
        const progress = e.progress || 0;
        lastProgress = progress;

        queueUpdate({
          velocity: vel,
          normalizedVelocity: norm,
          isScrolling: Math.abs(vel) > 0.05,
          scrollProgress: progress,
        });

        if (settleTimeoutRef.current) {
          window.clearTimeout(settleTimeoutRef.current);
        }
        settleTimeoutRef.current = window.setTimeout(() => {
          queueUpdate({ velocity: 0, normalizedVelocity: 0, isScrolling: false, scrollProgress: lastProgress });
        }, 120);
      };

      lenis.on('scroll', handleScroll);
      return () => {
        lenis.off('scroll', handleScroll);
        cleanupRaf();
      };
    }

    // Fallback window scroll listener
    let lastScrollTop = window.scrollY || 0;
    let lastTime = performance.now();
    let lastProgress = 0;

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
      lastProgress = progress;

      queueUpdate({
        velocity: vel,
        normalizedVelocity: Math.min(Math.abs(vel) / 15, 1),
        isScrolling: true,
        scrollProgress: progress,
      });

      if (settleTimeoutRef.current) {
        window.clearTimeout(settleTimeoutRef.current);
      }
      settleTimeoutRef.current = window.setTimeout(() => {
        queueUpdate({ velocity: 0, normalizedVelocity: 0, isScrolling: false, scrollProgress: lastProgress });
      }, 120);
    };

    window.addEventListener('scroll', onWindowScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onWindowScroll);
      cleanupRaf();
    };
  }, [controller, reducedMotion]);

  return state;
}
