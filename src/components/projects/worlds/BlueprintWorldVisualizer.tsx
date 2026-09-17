import React from 'react';

export const BlueprintWorldVisualizer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full aspect-[16/9] bg-[#07070B] border border-purple-500/40 overflow-hidden select-none group ${className}`}>
      {/* 12-Column Blueprint Drafting Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="blueprint-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#A855F7" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />

        {/* 12 Drafting Column Guidelines */}
        <line x1="8.33%" y1="0%" x2="8.33%" y2="100%" stroke="#A855F7" strokeWidth="0.75" strokeDasharray="2 4" />
        <line x1="25%" y1="0%" x2="25%" y2="100%" stroke="#A855F7" strokeWidth="0.75" strokeDasharray="2 4" />
        <line x1="41.66%" y1="0%" x2="41.66%" y2="100%" stroke="#A855F7" strokeWidth="0.75" strokeDasharray="2 4" />
        <line x1="58.33%" y1="0%" x2="58.33%" y2="100%" stroke="#A855F7" strokeWidth="0.75" strokeDasharray="2 4" />
        <line x1="75%" y1="0%" x2="75%" y2="100%" stroke="#A855F7" strokeWidth="0.75" strokeDasharray="2 4" />
        <line x1="91.66%" y1="0%" x2="91.66%" y2="100%" stroke="#A855F7" strokeWidth="0.75" strokeDasharray="2 4" />
      </svg>

      {/* Top Header Telemetry */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-purple-400/80 border-b border-purple-500/20 pb-2 z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span>BLUEPRINT // MOTION ENGINE ARCHITECTURE</span>
        </div>
        <span className="text-foreground-muted">SYSTEM: GSAP + THREE</span>
      </div>

      {/* Measured Dimension Callouts & Registration Crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
        <div className="relative w-4/5 h-3/5 border border-purple-500/50 bg-purple-950/10 p-4 flex flex-col justify-between">
          {/* Corner Registration Ticks */}
          <span className="absolute -top-2 -left-2 font-mono text-[9px] text-purple-400 leading-none">+</span>
          <span className="absolute -top-2 -right-2 font-mono text-[9px] text-purple-400 leading-none">+</span>
          <span className="absolute -bottom-2 -left-2 font-mono text-[9px] text-purple-400 leading-none">+</span>
          <span className="absolute -bottom-2 -right-2 font-mono text-[9px] text-purple-400 leading-none">+</span>

          {/* Dimension Labels */}
          <div className="flex items-center justify-between font-mono text-[8px] sm:text-[9px] uppercase text-purple-300">
            <span>DIM: 12-COL // 1440PX</span>
            <span>TOKEN: EASING.EDITORIAL</span>
          </div>

          <div className="text-center font-mono text-[10px] uppercase tracking-widest text-purple-200">
            [ UNIFIED RAF LOOP SYNCHRONIZATION ]
          </div>

          <div className="flex items-center justify-between font-mono text-[8px] sm:text-[9px] uppercase text-purple-300">
            <span>SCALE // 1:1</span>
            <span>ACCESSIBILITY // GATED</span>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-3 left-4 right-4 bg-background/90 border border-purple-500/30 p-2 z-10 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-foreground-muted">
        <span>BLUEPRINT READY</span>
        <span className="text-purple-400">ZERO JANK VERIFIED</span>
      </div>
    </div>
  );
};
