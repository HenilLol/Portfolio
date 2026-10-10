import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface VelocitySkewProps {
  children: React.ReactNode;
  className?: string;
  /** Max skew in degrees at peak scroll velocity (default 1.1) */
  maxSkew?: number;
  /** Velocity at which skew saturates (default 0.05 px/ms ≈ fast flick) */
  saturationVelocity?: number;
}

/**
 * Scroll-velocity skew: leans its children proportional to scroll speed,
 * easing back to rest when scrolling stops. Pure rAF loop — no re-renders,
 * transform applied directly to the DOM node.
 *
 * Design notes (learned from shipping this on an 11k-px page):
 * - ONLY skewY is applied. A scaleY squish on a tall element scales around
 *   the element's own center, which visibly drags on-screen text up/down by
 *   many pixels mid-scroll — reads as broken/laggy scrolling.
 * - transform-origin is recomputed each frame to pin the skew pivot to the
 *   center of the visible viewport, so on-screen text never slides away
 *   from the cursor while skewing.
 * - `will-change: transform` is only applied WHILE scrolling; at rest the
 *   layer is demoted so the compositor doesn't hold a giant GPU layer.
 */
export const VelocitySkew: React.FC<VelocitySkewProps> = ({
  children,
  className,
  maxSkew = 1.1,
  saturationVelocity = 0.05,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  // Only pay the rAF cost on non-touch desktops with motion allowed
  useEffect(() => {
    const isDesktop = window.matchMedia('(pointer: fine)').matches;
    setEnabled(isDesktop && !reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const node = ref.current;
    let raf = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let smoothedVelocity = 0;
    let resting = true;

    const loop = (t: number) => {
      const dt = Math.max(1, t - lastT);
      const y = window.scrollY;
      // px per ms, signed
      const rawVelocity = (y - lastY) / dt;
      lastY = y;
      lastT = t;

      // Exponential smoothing so flicks feel organic, not twitchy
      smoothedVelocity = smoothedVelocity * 0.86 + rawVelocity * 0.14;

      const clamped = Math.max(-saturationVelocity * 2, Math.min(saturationVelocity * 2, smoothedVelocity));
      const t01 = Math.min(1, Math.abs(clamped) / saturationVelocity);

      // Ease-out curve: subtle at low speeds, punchy at flicks
      const power = t01 * t01 * (3 - 2 * t01); // smoothstep
      const skew = maxSkew * power * Math.sign(clamped) * -1; // lean INTO the motion

      if (Math.abs(smoothedVelocity) < 0.0004) {
        if (!resting) {
          node.style.transform = '';
          node.style.transformOrigin = '';
          node.style.willChange = '';
          resting = true;
        }
      } else {
        // Pin the skew pivot to the center of the VISIBLE viewport so
        // on-screen text never slides away from the cursor.
        const rect = node.getBoundingClientRect();
        const pivotYInView = window.innerHeight / 2 - rect.top;
        node.style.transformOrigin = `50% ${Math.round(pivotYInView)}px`;
        node.style.willChange = 'transform';
        node.style.transform = `skewY(${skew.toFixed(3)}deg)`;
        resting = false;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled, maxSkew, saturationVelocity]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
};
