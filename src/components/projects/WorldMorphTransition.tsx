import React, { useState, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverProgress, setHoverProgress] = useState<number>(0.5);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  const fromLower = fromWorld.toLowerCase();
  const toLower = toWorld.toLowerCase();

  // Determine transition archetype
  const isHeneoxyToAero = fromLower.includes('heneoxy') || toLower.includes('aero');
  const isAeroToCoal = fromLower.includes('aero') || toLower.includes('coal');
  const isCoalToBlueprint = fromLower.includes('coal') || toLower.includes('blueprint');

  // Mouse scrub interaction across transition
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverProgress(x);
  };

  if (reducedMotion) {
    return (
      <div className="py-8 flex items-center justify-center">
        <div className="w-full max-w-md h-[1px] bg-border/40" />
      </div>
    );
  }

  // Morph progress (0 = fromWorld, 1 = toWorld)
  const progress = isInteracting ? hoverProgress : 0.5;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => {
        setIsInteracting(false);
        setHoverProgress(0.5);
      }}
      onMouseMove={handleMouseMove}
      className="relative w-full my-8 sm:my-16 py-8 px-4 sm:px-8 border border-border/60 bg-[#07090E]/80 backdrop-blur-md overflow-hidden select-none group"
    >
      {/* Background Precision Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Morph Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/40 font-mono text-[9px] uppercase tracking-widest text-foreground-muted relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span className="text-foreground">WORLD MORPH // SPATIAL TOPOLOGY TRANSLATION</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-accent">{fromWorld.toUpperCase()}</span>
          <span>→</span>
          <span className="text-foreground">{toWorld.toUpperCase()}</span>
          <span className="hidden sm:inline-block text-border">/</span>
          <span className="hidden sm:inline-block text-[8px] text-foreground-muted">SCRUB INTERACTIVE</span>
        </div>
      </div>

      {/* Central Visual Morphing Viewport Canvas */}
      <div className="relative w-full h-36 sm:h-44 flex items-center justify-center my-4 overflow-hidden">
        {/* Archetype 1: HENEOXY (Agentic Spatial Nodes) -> AEROINDEX (Radar Flight Vectors) */}
        {isHeneoxyToAero && (
          <svg className="w-full h-full" viewBox="0 0 800 160" fill="none">
            {/* Interpolating Concentric Radar Waves / Agent Ring Bus */}
            <circle
              cx="400"
              cy="80"
              r={40 + progress * 35}
              stroke="#00F0FF"
              strokeWidth="1"
              strokeDasharray={`${6 - progress * 3} ${4 + progress * 2}`}
              opacity={0.4 + progress * 0.3}
            />
            <circle
              cx="400"
              cy="80"
              r={80 + progress * 40}
              stroke="#3B82F6"
              strokeWidth="1"
              strokeDasharray={`${8 - progress * 4} ${6 + progress * 2}`}
              opacity={0.25 + progress * 0.3}
            />

            {/* Sweep Angle Line rotating and extending */}
            <line
              x1="400"
              y1="80"
              x2={400 + Math.cos(progress * Math.PI * 2) * (70 + progress * 60)}
              y2={80 + Math.sin(progress * Math.PI * 2) * (70 + progress * 60)}
              stroke="#00F0FF"
              strokeWidth="1.5"
              opacity={0.8}
            />

            {/* Morphing Nodes -> Flight Target Vectors */}
            {[
              { initX: 220, initY: 60, destX: 180, destY: 45, label: 'VECTOR-01' },
              { initX: 320, initY: 110, destX: 310, destY: 90, label: 'ALT-320' },
              { initX: 480, initY: 50, destX: 490, destY: 70, label: 'TRK-084' },
              { initX: 580, initY: 100, destX: 620, destY: 115, label: 'VECTOR-02' },
            ].map((pt, i) => {
              const curX = pt.initX + (pt.destX - pt.initX) * progress;
              const curY = pt.initY + (pt.destY - pt.initY) * progress;
              const isVector = progress > 0.45;

              return (
                <g key={i} className="transition-all duration-200">
                  {/* Node Connector Line */}
                  <line
                    x1="400"
                    y1="80"
                    x2={curX}
                    y2={curY}
                    stroke="rgba(0, 240, 255, 0.2)"
                    strokeWidth="0.75"
                    strokeDasharray="2 4"
                  />

                  {/* Morphing Shape: Circle in Heneoxy -> Delta Arrow in AeroIndex */}
                  {!isVector ? (
                    <circle cx={curX} cy={curY} r="5" fill="#00F0FF" opacity="0.85" />
                  ) : (
                    <path
                      d={`M ${curX} ${curY - 6} L ${curX + 6} ${curY + 6} L ${curX} ${curY + 3} L ${curX - 6} ${curY + 6} Z`}
                      fill="#3B82F6"
                      stroke="#00F0FF"
                      strokeWidth="0.75"
                    />
                  )}

                  {/* Dynamic Technical Label */}
                  <text
                    x={curX + 10}
                    y={curY + 3}
                    fill={isVector ? '#93C5FD' : '#67E8F9'}
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {isVector ? pt.label : `NODE_0${i + 1}`}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* Archetype 2: AEROINDEX (Radar Flight Vectors) -> COALINTEL (Stratified Geological Strata) */}
        {isAeroToCoal && !isHeneoxyToAero && (
          <svg className="w-full h-full" viewBox="0 0 800 160" fill="none">
            {/* Morphing Waves: Arcs flattening into geological strata */}
            {[25, 55, 85, 115, 140].map((yBase, idx) => {
              const curvature = (1 - progress) * (40 - idx * 6);
              const waviness = progress * 14;
              const pathD = `M 40 ${yBase} Q 200 ${yBase - curvature + (idx % 2 === 0 ? waviness : -waviness)}, 400 ${yBase} T 760 ${yBase}`;

              return (
                <path
                  key={idx}
                  d={pathD}
                  stroke={idx === 2 ? '#F59E0B' : 'rgba(245, 158, 11, 0.4)'}
                  strokeWidth={idx === 2 ? '1.5' : '1'}
                  strokeDasharray={progress > 0.5 ? 'none' : '4 4'}
                  fill="none"
                />
              );
            })}

            {/* Depth Markers appearing as we transition to CoalIntel */}
            {progress > 0.35 && (
              <g opacity={progress}>
                <text x="60" y="40" fill="#F59E0B" fontSize="8" fontFamily="monospace">
                  STRATUM-01 // -40M
                </text>
                <text x="60" y="90" fill="#F59E0B" fontSize="8" fontFamily="monospace">
                  MINING SEAM-B // -120M
                </text>
                <text x="60" y="135" fill="#F59E0B" fontSize="8" fontFamily="monospace">
                  BASAL BEDROCK // -260M
                </text>
                <line x1="160" y1="20" x2="160" y2="150" stroke="#F59E0B" strokeWidth="0.5" strokeDasharray="2 4" />
              </g>
            )}
          </svg>
        )}

        {/* Archetype 3: COALINTEL (Geological Strata) -> BLUEPRINT (Isometric Perspective Wireframe) */}
        {isCoalToBlueprint && (
          <svg className="w-full h-full" viewBox="0 0 800 160" fill="none">
            {/* Lines snapping from organic strata to rigid perspective grid planes */}
            {[20, 50, 80, 110, 140].map((yPos, i) => {
              const angleSnap = progress * (i * 12 - 24);
              const strokeColor = progress > 0.5 ? '#A855F7' : '#F59E0B';

              return (
                <line
                  key={i}
                  x1={80 + progress * 60}
                  y1={yPos + angleSnap * 0.4}
                  x2={720 - progress * 60}
                  y2={yPos - angleSnap * 0.4}
                  stroke={strokeColor}
                  strokeWidth="1"
                  opacity={0.4 + (i === 2 ? 0.4 : 0)}
                  strokeDasharray={progress > 0.6 ? 'none' : '3 3'}
                />
              );
            })}

            {/* Perspective Isometric Cross-Grid appearing on Blueprint side */}
            {progress > 0.4 && (
              <g opacity={(progress - 0.4) * 1.6}>
                <line x1="260" y1="20" x2="340" y2="140" stroke="#C084FC" strokeWidth="0.75" />
                <line x1="400" y1="20" x2="400" y2="140" stroke="#C084FC" strokeWidth="1" />
                <line x1="540" y1="20" x2="460" y2="140" stroke="#C084FC" strokeWidth="0.75" />
                <text x="410" y="35" fill="#C084FC" fontSize="8" fontFamily="monospace">
                  SCALE // 1:1 AXIS
                </text>
                <text x="410" y="130" fill="#C084FC" fontSize="8" fontFamily="monospace">
                  TOKEN: EASING.EDITORIAL
                </text>
              </g>
            )}
          </svg>
        )}
      </div>

      {/* Interactive Scrub Slider / Guide */}
      <div className="relative w-full flex items-center justify-between font-mono text-[9px] text-foreground-muted uppercase pt-2 border-t border-border/30">
        <div className="flex items-center gap-2">
          <span className="text-accent">{fromWorld.toUpperCase()}</span>
          <span>(STATE 0)</span>
        </div>

        {/* Progress Bar with Draggable Indicator */}
        <div className="w-1/3 max-w-xs h-1 bg-border/40 relative rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span>(STATE 1)</span>
          <span className="text-foreground">{toWorld.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
