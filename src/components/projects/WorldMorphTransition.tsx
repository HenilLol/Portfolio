import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface WorldMorphTransitionProps {
  fromWorld: string;
  toWorld: string;
}

export const WorldMorphTransition: React.FC<WorldMorphTransitionProps> = ({
  fromWorld,
  toWorld,
}) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="py-6 flex items-center justify-center">
        <div className="w-full max-w-xs h-[1px] bg-border/40" />
      </div>
    );
  }

  return (
    <div className="relative w-full py-8 sm:py-12 overflow-hidden select-none flex flex-col items-center justify-center">
      {/* Morphing Connector Line */}
      <div className="relative w-full max-w-2xl h-12 flex items-center justify-center">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 600 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Guide Line */}
          <line
            x1="0"
            y1="24"
            x2="600"
            y2="24"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Animated Morphing Connector Wave */}
          <motion.path
            d="M 0 24 Q 150 6, 300 24 T 600 24"
            stroke="url(#morph-gradient)"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0.3 }}
            whileInView={{ pathLength: 1, opacity: 0.8 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Linear Gradient transitioning between world accents */}
          <defs>
            <linearGradient id="morph-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central Morph Signal Pill */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-surface/90 border border-border/80 px-3 py-1 backdrop-blur-sm flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>
            {fromWorld.toUpperCase()} → {toWorld.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
