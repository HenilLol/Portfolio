import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface VelocitySkewProps {
  children: React.ReactNode;
  className?: string;
  /** Max skew in degrees at peak scroll velocity (default 3.5) */
  maxSkew?: number;
  /** Max vertical squish in px at peak velocity (default 6) */
  maxSquish?: number;
  /** Velocity at which skew saturates (default 0.05 px/ms ≈ fast flick) */
  saturationVelocity?: number;
}

/**
 * Scroll-velocity skew: leans and squashes its children proportional to
 * scroll speed, easing back to rest when scrolling stops. Pure rAF loop —
 * no re-renders, transforms applied directly to the DOM node.
 *
 * Read Lenis's live velocity from the running instance (natively exposed
 * as `velocity`), falling back to a wheel/touch-derived estimate.
 */
export const VelocitySkew: React.FC<VelocitySkewProps> = ({
  children,
  className,
  maxSkew = 3.5,
  maxSquish = 6,
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
      const squish = maxSquish * power;

      if (Math.abs(smoothedVelocity) < 0.0004) {
        node.style.transform = '';
      } else {
        node.style.transform = `skewY(${skew.toFixed(3)}deg) scaleY(${(1 - squish / 400).toFixed(4)})`;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled, maxSkew, maxSquish, saturationVelocity]);

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
};
