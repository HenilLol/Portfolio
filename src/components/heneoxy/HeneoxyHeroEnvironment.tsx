import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SubsystemNode {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  status: string;
}

const NODES: SubsystemNode[] = [
  { id: 'agent', name: 'AGENT DISPATCH', code: 'AGT//01', x: 1050, y: 175, status: 'ACTIVE' },
  { id: 'memory', name: 'MEMORY VAULT', code: 'MEM//02', x: 670, y: 175, status: 'SYNCED' },
  { id: 'sandbox', name: 'RPC SANDBOX', code: 'SBX//03', x: 670, y: 525, status: 'REVIEWED' },
  { id: 'context', name: 'CONTEXT STREAM', code: 'CTX//04', x: 1050, y: 525, status: 'STREAMING' },
  { id: 'bus', name: 'EVENT BUS', code: 'BUS//05', x: 860, y: 70, status: 'NOMINAL' },
  { id: 'vector', name: 'VECTOR STORE', code: 'VEC//06', x: 550, y: 350, status: 'INDEXED' },
  { id: 'telemetry', name: 'TELEMETRY SYNC', code: 'TEL//07', x: 1160, y: 350, status: '60HZ' },
];

// Fixed deterministic ambient particle coordinates
const AMBIENT_PARTICLES = [
  { cx: 320, cy: 120, r: 1.5, o: 0.35 },
  { cx: 480, cy: 90, r: 1.2, o: 0.25 },
  { cx: 580, cy: 260, r: 1.8, o: 0.45 },
  { cx: 710, cy: 190, r: 1.4, o: 0.30 },
  { cx: 890, cy: 110, r: 2.0, o: 0.50 },
  { cx: 960, cy: 280, r: 1.2, o: 0.35 },
  { cx: 1070, cy: 240, r: 1.6, o: 0.40 },
  { cx: 1120, cy: 130, r: 1.4, o: 0.30 },
  { cx: 360, cy: 460, r: 1.6, o: 0.30 },
  { cx: 490, cy: 420, r: 1.2, o: 0.25 },
  { cx: 560, cy: 480, r: 1.8, o: 0.40 },
  { cx: 740, cy: 490, r: 1.5, o: 0.35 },
  { cx: 880, cy: 430, r: 1.3, o: 0.30 },
  { cx: 940, cy: 480, r: 1.7, o: 0.45 },
  { cx: 1080, cy: 440, r: 1.5, o: 0.35 },
  { cx: 760, cy: 230, r: 2.2, o: 0.60 },
  { cx: 880, cy: 270, r: 1.8, o: 0.50 },
  { cx: 850, cy: 410, r: 2.0, o: 0.55 },
  { cx: 780, cy: 410, r: 1.5, o: 0.40 },
  { cx: 670, cy: 350, r: 2.2, o: 0.65 },
  { cx: 970, cy: 350, r: 2.0, o: 0.55 },
  { cx: 250, cy: 280, r: 1.2, o: 0.20 },
  { cx: 290, cy: 390, r: 1.4, o: 0.25 },
  { cx: 1160, cy: 220, r: 1.6, o: 0.35 },
  { cx: 1180, cy: 460, r: 1.4, o: 0.30 },
];

export const HeneoxyHeroEnvironment: React.FC<{ className?: string }> = ({ className = '' }) => {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = ((e.clientX / innerWidth) - 0.5) * 18;
      targetY = ((e.clientY / innerHeight) - 0.5) * 14;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const tick = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setOffset({ x: currentX, y: currentY });
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [reducedMotion]);

  // Core coordinate center on desktop (anchored on right side of layout)
  const coreX = 860;
  const coreY = 350;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
    >
      {/* 1. Ambient Radial Atmosphere & Cyan Illumination Field */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 65% 60% at 75% 50%, rgba(0, 240, 255, 0.12) 0%, rgba(56, 189, 248, 0.04) 45%, rgba(7, 9, 14, 0) 80%)`,
        }}
      />

      {/* 2. Micro-Grid Coordinate Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 240, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 75% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 75% 50%, black 20%, transparent 80%)',
        }}
      />

      {/* 3. Master Ambient Vector Computing SVG */}
      <div
        className="absolute inset-0 z-10 w-full h-full flex items-center justify-center will-change-transform"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        }}
      >
        <svg
          viewBox="0 0 1200 700"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft Cyan Glow Filter */}
            <filter id="heneoxyGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="strongGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Coordinate Axes through Core */}
          <g opacity="0.35">
            <line x1="520" y1={coreY} x2="1180" y2={coreY} stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1" strokeDasharray="3 9" />
            <line x1={coreX} y1="40" x2={coreX} y2="660" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1" strokeDasharray="3 9" />
            {/* Diagonal Alignment Crosshairs */}
            <line x1={coreX - 280} y1={coreY - 280} x2={coreX + 280} y2={coreY + 280} stroke="rgba(0, 240, 255, 0.12)" strokeWidth="1" strokeDasharray="2 12" />
            <line x1={coreX - 280} y1={coreY + 280} x2={coreX + 280} y2={coreY - 280} stroke="rgba(0, 240, 255, 0.12)" strokeWidth="1" strokeDasharray="2 12" />
          </g>

          {/* Concentric System Orbits */}
          <g>
            {/* Orbit 1: Inner Kernel Boundary */}
            <circle cx={coreX} cy={coreY} r="90" fill="none" stroke="rgba(0, 240, 255, 0.35)" strokeWidth="1.2" strokeDasharray="4 6" />
            
            {/* Orbit 2: Primary Subsystem Track */}
            <circle cx={coreX} cy={coreY} r="180" fill="none" stroke="rgba(0, 240, 255, 0.28)" strokeWidth="1" strokeDasharray="2 8" />

            {/* Orbit 3: Subsystem Core Constellation */}
            <circle cx={coreX} cy={coreY} r="270" fill="none" stroke="rgba(56, 189, 248, 0.24)" strokeWidth="1.2" />

            {/* Orbit 4: Outer Ring with Calibration Indexing */}
            <circle cx={coreX} cy={coreY} r="380" fill="none" stroke="rgba(0, 240, 255, 0.16)" strokeWidth="1" strokeDasharray="8 16" />

            {/* Orbit 5: Ambient Territory Horizon */}
            <circle cx={coreX} cy={coreY} r="520" fill="none" stroke="rgba(0, 240, 255, 0.09)" strokeWidth="1" strokeDasharray="2 24" />
          </g>

          {/* Rotating Calibration Reticle Ring */}
          {!reducedMotion && (
            <g
              className="origin-[860px_350px] animate-[spin_60s_linear_infinite]"
              style={{ transformOrigin: `${coreX}px ${coreY}px` }}
            >
              <circle cx={coreX} cy={coreY} r="225" fill="none" stroke="rgba(0, 240, 255, 0.22)" strokeWidth="1" strokeDasharray="2 14" />
              <line x1={coreX + 220} y1={coreY} x2={coreX + 230} y2={coreY} stroke="#00F0FF" strokeWidth="2" />
              <line x1={coreX - 220} y1={coreY} x2={coreX - 230} y2={coreY} stroke="#00F0FF" strokeWidth="2" />
              <line x1={coreX} y1={coreY + 220} x2={coreX} y2={coreY + 230} stroke="#00F0FF" strokeWidth="2" />
              <line x1={coreX} y1={coreY - 220} x2={coreX} y2={coreY - 230} stroke="#00F0FF" strokeWidth="2" />
            </g>
          )}

          {/* Bus Interconnect Filaments between Core and Nodes */}
          {NODES.map((node) => (
            <g key={`bus-${node.id}`}>
              {/* Bus Vector Line */}
              <line
                x1={coreX}
                y1={coreY}
                x2={node.x}
                y2={node.y}
                stroke="rgba(0, 240, 255, 0.32)"
                strokeWidth="1"
                strokeDasharray="6 6"
              />

              {/* High-Luminosity Animated Data Packets */}
              {!reducedMotion && (
                <circle r="3" fill="#00F0FF" filter="url(#heneoxyGlow)">
                  <animate
                    attributeName="cx"
                    values={`${coreX};${node.x}`}
                    dur={`${2.2 + (node.x % 3) * 0.4}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${coreY};${node.y}`}
                    dur={`${2.2 + (node.x % 3) * 0.4}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.2;1;0.2"
                    dur={`${2.2 + (node.x % 3) * 0.4}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          ))}

          {/* Inter-Node Lateral Connection Bridges */}
          <g opacity="0.30">
            <line x1="670" y1="175" x2="670" y2="525" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1" strokeDasharray="3 6" />
            <line x1="1050" y1="175" x2="1050" y2="525" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1" strokeDasharray="3 6" />
            <line x1="670" y1="175" x2="1050" y2="175" stroke="rgba(0, 240, 255, 0.20)" strokeWidth="1" strokeDasharray="4 8" />
            <line x1="670" y1="525" x2="1050" y2="525" stroke="rgba(0, 240, 255, 0.20)" strokeWidth="1" strokeDasharray="4 8" />
          </g>

          {/* Ambient Drifting Particles */}
          <g>
            {AMBIENT_PARTICLES.map((p, idx) => (
              <circle
                key={`p-${idx}`}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="#00F0FF"
                opacity={p.o}
              >
                {!reducedMotion && (
                  <animate
                    attributeName="opacity"
                    values={`${p.o * 0.5};${p.o * 1.3};${p.o * 0.5}`}
                    dur={`${3 + (idx % 4)}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            ))}
          </g>

          {/* Spatial Subsystem Nodes */}
          {NODES.map((node) => (
            <g key={`node-${node.id}`} className="select-none">
              {/* Node Outer Reticle Halo */}
              <circle
                cx={node.x}
                cy={node.y}
                r="18"
                fill="rgba(7, 10, 18, 0.85)"
                stroke="rgba(0, 240, 255, 0.45)"
                strokeWidth="1"
              />

              {/* Node Center Beacon */}
              <circle
                cx={node.x}
                cy={node.y}
                r="4"
                fill="#00F0FF"
                filter="url(#heneoxyGlow)"
              />

              {/* Node Text Callout */}
              <text
                x={node.x}
                y={node.y - 24}
                textAnchor="middle"
                className="font-mono text-[9px] fill-[#00F0FF] font-semibold tracking-widest uppercase"
              >
                {node.name}
              </text>
              <text
                x={node.x}
                y={node.y + 30}
                textAnchor="middle"
                className="font-mono text-[8px] fill-[#38BDF8] tracking-wider uppercase opacity-80"
              >
                {node.code} · {node.status}
              </text>
            </g>
          ))}

          {/* Master Microkernel Central Core */}
          <g>
            {/* Core Outer Halo */}
            <circle
              cx={coreX}
              cy={coreY}
              r="48"
              fill="rgba(7, 10, 18, 0.95)"
              stroke="#00F0FF"
              strokeWidth="1.5"
              filter="url(#strongGlow)"
              opacity="0.8"
            />
            {/* Concentric Reticle Band */}
            <circle
              cx={coreX}
              cy={coreY}
              r="40"
              fill="none"
              stroke="rgba(0, 240, 255, 0.4)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            {/* Core Center Pulse */}
            <circle
              cx={coreX}
              cy={coreY}
              r="8"
              fill="#00F0FF"
              filter="url(#strongGlow)"
            >
              {!reducedMotion && (
                <animate
                  attributeName="r"
                  values="6;9;6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </circle>

            {/* Core Telemetry Labels */}
            <text
              x={coreX}
              y={coreY + 22}
              textAnchor="middle"
              className="font-mono text-[9px] fill-[#00F0FF] font-extrabold tracking-widest uppercase"
            >
              CORE // KERNEL
            </text>
          </g>

          {/* Technical Telemetry Stamping & Reticles */}
          <g className="font-mono text-[9px] fill-foreground-muted tracking-widest uppercase select-none opacity-50">
            <text x="680" y="80">SYS.TOPOLOGY // [0x4A, 0x1F]</text>
            <text x="1050" y="640">SUBSTRATE // AGENTIC CANVASES</text>
            <text x="670" y="380">EVENT.LOOP // NOMINAL 60HZ</text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default HeneoxyHeroEnvironment;
