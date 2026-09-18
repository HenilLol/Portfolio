import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Badge } from '@/components/ui/Badge';
import { ABOUT_CONTENT, type TechnicalDimension } from '@/data/aboutContent';
import { useEnvironment } from '@/components/experience/EnvironmentContext';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';

export const SpatialDimensionConstellation: React.FC = () => {
  const { activeDimension, setActiveDimension } = useEnvironment();
  const [hoveredNode, setHoveredNode] = useState<TechnicalDimension | null>(null);

  const dimensions = ABOUT_CONTENT.dimensions;
  const currentDim = hoveredNode || dimensions.find((d) => d.id === activeDimension) || dimensions[0];

  const handleMouseEnter = (dim: TechnicalDimension) => {
    setHoveredNode(dim);
    setActiveDimension(dim.id);
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div className="relative w-full border border-border/80 bg-background-surface/40 backdrop-blur-md p-6 sm:p-10 lg:p-12 space-y-10 overflow-hidden group">
      {/* Background Precision Grid Lines */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(0, 240, 255, 0.1) 0%, transparent 60%)`,
        }}
      />

      {/* Top Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40 font-mono text-[10px] tracking-widest uppercase text-foreground-muted">
        <div className="flex items-center gap-3">
          <TechnicalLabel indicator indicatorColor="accent">
            SPATIAL TAXONOMY // SIX DIMENSIONS
          </TechnicalLabel>
          <span className="text-border">/</span>
          <span className="text-accent">INTERACTIVE CONSTELLATION</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ACTIVE STATE: {currentDim.category}</span>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>
      </div>

      {/* Spatial Constellation Core Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Central Architectural Radar & Orbiting Dimension Nodes */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px]">
          {/* Central Rotating Architectural Core Radar */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Outer Concentric Degree Ring */}
            <div className="absolute inset-0 rounded-full border border-border/60 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-dashed border-accent/25 animate-[spin_40s_linear_infinite_reverse]" />
            <div className="absolute inset-12 rounded-full border border-border/40" />

            {/* Crosshair Axes */}
            <div className="absolute w-full h-[1px] bg-border/40" />
            <div className="absolute h-full w-[1px] bg-border/40" />

            {/* Core Beacon */}
            <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-background border border-accent/60 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_30px_rgba(0,240,255,0.1)]">
              <span className="w-2 h-2 rounded-full bg-accent mb-1 animate-ping" />
              <span className="font-mono text-[8px] uppercase tracking-widest text-accent font-semibold">
                SYSTEM
              </span>
              <span className="font-mono text-[7px] text-foreground-muted uppercase">
                RADAR CORE
              </span>
            </div>

            {/* 6 Spatial Orbiting Dimension Pills arranged in a radial layout */}
            {dimensions.map((dim, idx) => {
              const angle = (idx * (360 / dimensions.length) - 90) * (Math.PI / 180);
              const radius = 120; // radial distance from center (px)
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isSelected = currentDim.id === dim.id;

              return (
                <div
                  key={dim.id}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  className="absolute transition-transform duration-300 z-20"
                >
                  <InteractiveCursorTarget cursorType="interactive">
                    <button
                      type="button"
                      onMouseEnter={() => handleMouseEnter(dim)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleMouseEnter(dim)}
                      className={`px-3 py-1.5 rounded-full border font-mono text-[9px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap cursor-pointer backdrop-blur-md shadow-md ${
                        isSelected
                          ? 'border-accent bg-accent/20 text-accent shadow-[0_0_15px_rgba(0,240,255,0.3)] scale-110'
                          : 'border-border/80 bg-background/80 text-foreground-secondary hover:border-accent/60 hover:text-foreground'
                      }`}
                    >
                      <span>{dim.category}</span>
                    </button>
                  </InteractiveCursorTarget>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dimension HUD Inspector */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDim.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="border border-accent/40 bg-background-surface/80 p-6 sm:p-8 space-y-5 relative shadow-[0_0_25px_rgba(0,240,255,0.03)]"
            >
              {/* Corner Framing Marks */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent" />

              <div className="flex items-center justify-between pb-3 border-b border-border/40 font-mono text-[10px] tracking-widest text-foreground-muted uppercase">
                <span className="text-accent font-semibold">SPEC INDEX // {currentDim.specIndex}</span>
                <Badge
                  variant={currentDim.status === 'CORE PRACTICE' ? 'accent' : 'outline'}
                  className="text-[8px] uppercase tracking-wider"
                >
                  {currentDim.status}
                </Badge>
              </div>

              <div>
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest block mb-1">
                  TECHNICAL FOCUS
                </span>
                <h4 className="font-editorial text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground">
                  {currentDim.focus}
                </h4>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/30">
                <span className="font-mono text-[9px] text-foreground-muted uppercase tracking-widest block">
                  CURRENT RESEARCH & LEARNING LOOP
                </span>
                <p className="font-mono text-xs text-foreground-secondary leading-relaxed bg-background/50 p-3 border border-border/40">
                  {currentDim.currentLearning}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between font-mono text-[9px] text-foreground-muted uppercase tracking-wider">
                <span>SYSTEM STATE: STABLE</span>
                <span className="text-accent">LINKED TO PERSISTENT 3D FIELD</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dimension Selector Pills for Quick Access */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            {dimensions.map((dim) => {
              const isSelected = currentDim.id === dim.id;
              return (
                <button
                  key={dim.id}
                  type="button"
                  onClick={() => handleMouseEnter(dim)}
                  className={`p-2 border font-mono text-[9px] uppercase tracking-wider text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-accent bg-accent/10 text-accent font-semibold'
                      : 'border-border/60 bg-background/40 text-foreground-muted hover:border-border hover:text-foreground'
                  }`}
                >
                  <div className="text-[8px] opacity-60">0{dim.specIndex}</div>
                  <div className="truncate">{dim.category}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
