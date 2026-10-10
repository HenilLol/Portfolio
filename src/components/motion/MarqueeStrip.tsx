import React, { useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface MarqueeStripProps {
  items: string[];
  /** Seconds per full loop (default 26) */
  duration?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * Infinite kinetic marquee — pure CSS animation, zero JS per frame.
 * Renders the item list twice for a seamless loop and applies an
 * accent-tinted hover freeze so it feels interactive without cost.
 */
export const MarqueeStrip: React.FC<MarqueeStripProps> = ({
  items,
  duration = 26,
  reverse = false,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const stripRef = useRef<HTMLDivElement>(null);

  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-12 pr-12"
    >
      {items.map((item, i) => (
        <span
          key={i}
          className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-widest text-foreground-muted"
        >
          <span>{item}</span>
          <span className="text-accent">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`group relative overflow-hidden border-y border-border/60 bg-background-surface/40 py-3${className ? ` ${className}` : ''}`}
    >
      <div
        ref={stripRef}
        className="flex w-max"
        style={
          reducedMotion
            ? undefined
            : {
                animation: `marquee-scroll ${duration}s linear infinite`,
                animationDirection: reverse ? 'reverse' : 'normal',
              }
        }
        onMouseEnter={() => stripRef.current?.style.setProperty('animation-play-state', 'paused')}
        onMouseLeave={() => stripRef.current?.style.setProperty('animation-play-state', 'running')}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
};
