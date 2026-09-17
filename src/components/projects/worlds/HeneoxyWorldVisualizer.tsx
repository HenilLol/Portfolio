import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const HeneoxyWorldVisualizer: React.FC<{ className?: string }> = ({ className = '' }) => {
  const reducedMotion = useReducedMotion();
  const [activeNode, setActiveNode] = useState<number>(0);

  const nodes = [
    { id: 0, label: 'KERNEL', role: 'State Streaming Event Bus', x: 20, y: 35, status: 'STREAMING' },
    { id: 1, label: 'AGENT // DISPATCH', role: 'Context & Prompt Memory', x: 50, y: 22, status: 'DISPATCHING' },
    { id: 2, label: 'RPC SANDBOX', role: 'Deterministic Local Tools', x: 80, y: 38, status: 'ACTIVE' },
    { id: 3, label: 'SPATIAL CANVAS', role: 'Spatial Telemetry UI', x: 50, y: 68, status: 'SYNCED' },
  ];

  return (
    <div className={`relative w-full aspect-[16/10] bg-[#07090E] border border-accent/40 overflow-hidden select-none group ${className}`}>
      {/* Dynamic Background Matrix */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="heneoxy-world-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#00F0FF" strokeWidth="0.5" strokeDasharray="2 4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heneoxy-world-grid)" />
      </svg>

      {/* Top HUD Telemetry */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-accent/80 border-b border-accent/20 pb-2 z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>SYS // AGENTIC COMPUTING ENVIRONMENT</span>
        </div>
        <span className="text-foreground-muted">STATUS: OPERATIONAL</span>
      </div>

      {/* Animated Connection Lines */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        {/* Node 0 to Node 1 */}
        <line x1="20%" y1="35%" x2="50%" y2="22%" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" strokeDasharray="4 4" />
        {/* Node 1 to Node 2 */}
        <line x1="50%" y1="22%" x2="80%" y2="38%" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" strokeDasharray="4 4" />
        {/* Node 0 to Node 3 */}
        <line x1="20%" y1="35%" x2="50%" y2="68%" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" strokeDasharray="4 4" />
        {/* Node 2 to Node 3 */}
        <line x1="80%" y1="38%" x2="50%" y2="68%" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Dynamic Pulsing Dispatch Packets */}
        {!reducedMotion && (
          <>
            <circle cx="35%" cy="28.5%" r="2.5" fill="#00F0FF">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="65%" cy="30%" r="2.5" fill="#00F0FF">
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="50%" cy="45%" r="2" fill="#00F0FF">
              <animate attributeName="opacity" values="0.1;0.9;0.1" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>

      {/* Interactive System Nodes */}
      {nodes.map((node) => {
        const isSelected = activeNode === node.id;
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => setActiveNode(node.id)}
            onMouseEnter={() => setActiveNode(node.id)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 text-left focus:outline-none cursor-pointer group/node"
          >
            <motion.div
              animate={{
                scale: isSelected ? 1.15 : 1,
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`p-2 sm:p-2.5 border transition-colors duration-300 backdrop-blur-sm ${
                isSelected
                  ? 'border-accent bg-accent/20 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'border-accent/40 bg-background/90 group-hover/node:border-accent'
              }`}
            >
              <div className="flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-accent font-bold">
                <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-accent' : 'bg-accent/40'}`} />
                <span>{node.label}</span>
              </div>
              <div className="hidden sm:block font-mono text-[8px] text-foreground-muted uppercase tracking-tight mt-0.5">
                {node.status}
              </div>
            </motion.div>
          </button>
        );
      })}

      {/* Bottom Live Telemetry Terminal Strip */}
      <div className="absolute bottom-3 left-4 right-4 bg-background/90 border border-border/70 p-2 sm:p-2.5 z-10 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-accent">▶ TRACE:</span>
          <span className="text-foreground-secondary">{nodes[activeNode].role}</span>
        </div>
        <span className="text-accent/90 shrink-0 hidden sm:inline-block">INSPECT NODE ↗</span>
      </div>
    </div>
  );
};
