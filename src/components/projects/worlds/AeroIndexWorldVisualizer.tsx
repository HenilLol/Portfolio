import React, { useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const AeroIndexWorldVisualizer: React.FC<{ className?: string }> = ({ className = '' }) => {
  const reducedMotion = useReducedMotion();
  const [activeVector, setActiveVector] = useState<number>(0);

  const vectors = [
    { callsign: 'IX-402', alt: 'FL340', hdg: '042°', spd: '480KT', x: 28, y: 38 },
    { callsign: 'AI-108', alt: 'FL380', hdg: '118°', spd: '510KT', x: 62, y: 25 },
    { callsign: 'VT-ENG', alt: 'FL290', hdg: '275°', spd: '430KT', x: 74, y: 65 },
  ];

  return (
    <div className={`relative w-full aspect-[16/9] bg-[#05070B] border border-blue-500/40 overflow-hidden select-none group ${className}`}>
      {/* Aviation Polar Radar Range Rings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="20%" fill="none" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="1" />
        <circle cx="50%" cy="50%" r="35%" fill="none" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="1" />
        <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" strokeDasharray="3 6" />

        {/* Crosshair Coordinate Axes */}
        <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(59, 130, 246, 0.12)" strokeWidth="1" />
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(59, 130, 246, 0.12)" strokeWidth="1" />

        {/* Diagonal Vectors */}
        <line x1="28%" y1="38%" x2="62%" y2="25%" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="62%" y1="25%" x2="74%" y2="65%" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* Rotating Radar Sweep Line */}
      {!reducedMotion && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[120%] h-[120%] rounded-full animate-[spin_6s_linear_infinite]">
            <div
              className="w-1/2 h-1/2 origin-bottom-right"
              style={{
                background: 'conic-gradient(from 180deg at 100% 100%, rgba(59, 130, 246, 0.25) 0deg, transparent 60deg)',
              }}
            />
          </div>
        </div>
      )}

      {/* Top Telemetry Header */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-blue-400/80 border-b border-blue-500/20 pb-2 z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          <span>RADAR // HIGH-THROUGHPUT SPATIAL TELEMETRY</span>
        </div>
        <span className="text-foreground-muted">LATENCY: &lt;16MS</span>
      </div>

      {/* Flight Target Blips */}
      {vectors.map((vec, idx) => {
        const isSelected = activeVector === idx;
        return (
          <button
            key={vec.callsign}
            type="button"
            onClick={() => setActiveVector(idx)}
            onMouseEnter={() => setActiveVector(idx)}
            style={{ left: `${vec.x}%`, top: `${vec.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 text-left focus:outline-none cursor-pointer group/blip"
          >
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                  isSelected
                    ? 'border-blue-400 bg-blue-400 shadow-[0_0_10px_#3B82F6]'
                    : 'border-blue-400/60 bg-blue-500/20 group-hover/blip:scale-125'
                }`}
              />
              <div className="font-mono text-[9px] text-blue-300 tracking-wider font-semibold">
                {vec.callsign}
              </div>
            </div>
            <div className="pl-4 font-mono text-[8px] text-foreground-muted tracking-tight">
              {vec.alt} • {vec.hdg}
            </div>
          </button>
        );
      })}

      {/* Bottom Live Flight Vector Telemetry */}
      <div className="absolute bottom-3 left-4 right-4 bg-background/90 border border-blue-500/30 p-2 z-10 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-foreground-secondary">
        <div className="flex items-center gap-3">
          <span className="text-blue-400">TARGET: {vectors[activeVector].callsign}</span>
          <span className="hidden sm:inline">ALT: {vectors[activeVector].alt}</span>
          <span className="hidden sm:inline">SPEED: {vectors[activeVector].spd}</span>
        </div>
        <span className="text-blue-400">VECTOR LOCKED</span>
      </div>
    </div>
  );
};
