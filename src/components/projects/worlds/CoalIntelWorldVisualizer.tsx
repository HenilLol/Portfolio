import React, { useState } from 'react';

export const CoalIntelWorldVisualizer: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeLayer, setActiveLayer] = useState<number>(1);

  const strataLayers = [
    { id: 0, label: 'SURFACE TRANSIT', metric: 'MARITIME FLEET CONGESTION', depth: 'LAYER // 01', color: '#F59E0B' },
    { id: 1, label: 'MULTIMODAL RAIL CORRIDOR', metric: 'STOCKPILE DYNAMICS & DEMAND', depth: 'LAYER // 02', color: '#D97706' },
    { id: 2, label: 'TERMINAL EXTRACTION', metric: 'LOGISTIC BOTTLENECK SOLVER', depth: 'LAYER // 03', color: '#92400E' },
  ];

  return (
    <div className={`relative w-full aspect-[16/9] bg-[#0A0704] border border-amber-600/40 overflow-hidden select-none group ${className}`}>
      {/* Precision Geological Cross-Section Contour Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="strata-grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 0 10 Q 20 0 40 10 T 80 10" fill="none" stroke="#F59E0B" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#strata-grid)" />
      </svg>

      {/* Top Header Telemetry */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-amber-500/80 border-b border-amber-500/20 pb-2 z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>GEOSPATIAL INTELLIGENCE // FREIGHT CORRIDORS</span>
        </div>
        <span className="text-foreground-muted">POSTGRES RLS ACTIVE</span>
      </div>

      {/* Layered Strata Visual Plates */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 py-10 space-y-2 sm:space-y-3 z-10">
        {strataLayers.map((layer) => {
          const isSelected = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(layer.id)}
              onMouseEnter={() => setActiveLayer(layer.id)}
              className={`w-full text-left p-3 sm:p-3.5 border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-amber-500 bg-amber-950/40 shadow-[0_0_12px_rgba(245,158,11,0.2)] translate-x-1.5'
                  : 'border-amber-900/40 bg-background/80 hover:border-amber-700/60'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <span className={`w-1.5 h-1.5 rounded-sm ${isSelected ? 'bg-amber-400' : 'bg-amber-800'}`} />
                  <span>{layer.label}</span>
                </div>
                <span className="text-foreground-muted">{layer.depth}</span>
              </div>
              {isSelected && (
                <div className="mt-1 font-mono text-[8px] sm:text-[9px] text-foreground-secondary uppercase tracking-tight">
                  {layer.metric}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-3 left-4 right-4 bg-background/90 border border-amber-600/30 p-2 z-10 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-foreground-muted">
        <span>QUERY: DETERMINISTIC SOLVER</span>
        <span className="text-amber-500">OPTIMIZED CORRIDOR</span>
      </div>
    </div>
  );
};
