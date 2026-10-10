import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Ambient starfield drift: a lightweight 2D-canvas parallax star layer that
 * lives behind the content sections after the cinematic handover.
 *
 * - Three parallax depth bands; scroll-linked drift (stars lag the viewport)
 * - Occasional accent-tinted stars (#00F0FF family) among the white
 * - DPR-capped, pauses when tab hidden, honors reduced motion (static render)
 * - Single fixed canvas for the whole page — one rAF, negligible cost
 */
export const AmbientStarfield: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let stars: { x: number; y: number; r: number; band: number; tint: boolean; tw: number }[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;

    const buildStars = () => {
      const density = Math.min(320, Math.floor((w * h) / 9000));
      stars = Array.from({ length: density }).map((_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.25,
        band: i % 3, // 0 far, 1 mid, 2 near
        tint: Math.random() < 0.16,
        tw: Math.random() * Math.PI * 2, // twinkle phase
      }));
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    };

    resize();
    window.addEventListener('resize', resize);

    const render = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      const scrollY = window.scrollY;
      const speed = [0.010, 0.028, 0.055]; // parallax px per scroll px

      for (const s of stars) {
        // Wrap vertically around the viewport as scroll moves
        const yy = (((s.y - scrollY * speed[s.band]) % h) + h) % h;
        const twinkle = reducedMotion ? 1 : 0.55 + 0.45 * Math.sin(t * 0.0012 + s.tw);
        const alpha = (s.band === 0 ? 0.42 : s.band === 1 ? 0.65 : 0.95) * twinkle;

        if (s.tint) {
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.9})`;
        } else {
          ctx.fillStyle = `rgba(244, 244, 246, ${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(s.x, yy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reducedMotion) raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? 'fixed inset-0 pointer-events-none z-0'}
    />
  );
};

export default AmbientStarfield;
