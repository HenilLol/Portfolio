import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Badge } from '@/components/ui/Badge';
import { useEnvironment } from '@/components/experience/EnvironmentContext';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';

export interface CardinalDimension {
  id: string;
  category: 'ENGINEERING' | 'AI' | 'SYSTEMS' | 'CREATIVE';
  position: 'top' | 'right' | 'bottom' | 'left';
  code: string;
  tagline: string;
  spatialManifesto: string[];
  technologies: string[];
  visualMode: 'structural' | 'networked' | 'pipelined' | 'fluid';
  learningFocus: string;
}

const CARDINAL_DIMENSIONS: CardinalDimension[] = [
  {
    id: 'engineering',
    category: 'ENGINEERING',
    position: 'top',
    code: '01',
    tagline: 'BUILDING SYSTEMS THAT ACTUALLY WORK.',
    spatialManifesto: [
      'RIGOROUS COMPONENT ARCHITECTURE',
      'STRICT TYPE CONTRACTS',
      'HIGH-EFFICIENCY RUNTIME STATE',
    ],
    technologies: ['C / C++', 'TypeScript', 'React', 'Data Structures'],
    visualMode: 'structural',
    learningFocus: 'Advanced TypeScript type systems & concurrent state machines',
  },
  {
    id: 'ai',
    category: 'AI',
    position: 'right',
    code: '02',
    tagline: 'REASONING, CONTEXT & AGENTIC WORKFLOWS.',
    spatialManifesto: [
      'MULTI-TURN AUTONOMOUS AGENTS',
      'LOCAL MODEL TOOL CALLING',
      'STRUCTURED CONTEXT & MEMORY',
    ],
    technologies: ['LLM Orchestration', 'Agent Tooling', 'Prompt Engineering', 'MCP'],
    visualMode: 'networked',
    learningFocus: 'Autonomous multi-turn agent loops & deterministic evaluation',
  },
  {
    id: 'systems',
    category: 'SYSTEMS',
    position: 'bottom',
    code: '03',
    tagline: 'PIPELINES, RUNTIMES & ARCHITECTURAL DISCIPLINE.',
    spatialManifesto: [
      'OPTIMIZED BUILD INFRASTRUCTURE',
      'ROW-LEVEL PERSISTENCE SECURITY',
      'TELEMETRY DATA FLOWS',
    ],
    technologies: ['Vite / Rollup', 'PostgreSQL / RLS', 'Supabase', 'Git CI'],
    visualMode: 'pipelined',
    learningFocus: 'Bundle optimization, lazy chunking & secure client-server boundaries',
  },
  {
    id: 'creative',
    category: 'CREATIVE',
    position: 'left',
    code: '04',
    tagline: 'CINEMATIC INTERACTION & VISUAL STORYTELLING.',
    spatialManifesto: [
      'PROCEDURAL WEBGL SHADERS',
      'PHYSICS-DRIVEN TYPOGRAPHY',
      'CONTINUOUS TIME-SCROLL CHOREOGRAPHY',
    ],
    technologies: ['Three.js', 'WebGL / GLSL', 'GSAP ScrollTrigger', 'Motion'],
    visualMode: 'fluid',
    learningFocus: 'Fragment shader mathematics & spatial camera transformations',
  },
];

export const SpatialDimensionConstellation: React.FC = () => {
  const { activeDimension, setActiveDimension } = useEnvironment();
  const [activeDimId, setActiveDimId] = useState<string>('engineering');

  const currentDim =
    CARDINAL_DIMENSIONS.find((d) => d.id === activeDimId) ||
    CARDINAL_DIMENSIONS.find((d) => d.id === activeDimension) ||
    CARDINAL_DIMENSIONS[0];

  const handleSelectDimension = (dim: CardinalDimension) => {
    setActiveDimId(dim.id);
    setActiveDimension(dim.id);
  };

  return (
    <div className="relative w-full border border-border/80 bg-background-surface/40 backdrop-blur-md p-6 sm:p-10 lg:p-12 space-y-8 overflow-hidden group select-none">
      {/* Dynamic Background Visual Language per Active Mode */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 transition-all duration-700"
        style={{
          backgroundImage:
            currentDim.visualMode === 'structural'
              ? 'linear-gradient(to right, rgba(0, 240, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.15) 1px, transparent 1px)'
              : currentDim.visualMode === 'networked'
              ? 'radial-gradient(circle at 75% 50%, rgba(56, 189, 248, 0.25) 0%, transparent 55%)'
              : currentDim.visualMode === 'pipelined'
              ? 'repeating-linear-gradient(45deg, rgba(129, 140, 248, 0.08) 0, rgba(129, 140, 248, 0.08) 2px, transparent 2px, transparent 12px)'
              : 'radial-gradient(circle at 25% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 60%)',
          backgroundSize: currentDim.visualMode === 'structural' ? '32px 32px' : 'auto',
        }}
      />

      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40 font-mono text-[10px] tracking-widest uppercase text-foreground-muted">
        <div className="flex items-center gap-3">
          <TechnicalLabel indicator indicatorColor="accent">
            SPATIAL IDENTITY MATRIX // SPEC-02
          </TechnicalLabel>
          <span className="text-border">/</span>
          <span className="text-foreground">FOUR CORE DIMENSIONS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-accent">ACTIVE // {currentDim.category}</span>
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        </div>
      </div>

      {/* Main Composition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left / Center: Spatial Cardinal Map (HENIL at center with 4 directional nodes) */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[340px] sm:min-h-[400px]">
          {/* Central Connecting Axes Lines */}
          <div className="absolute w-64 sm:w-80 h-[1px] bg-border/60" />
          <div className="absolute h-64 sm:h-80 w-[1px] bg-border/60" />

          {/* Central Rotating Architectural Horizon Ring */}
          <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-border/40 animate-[spin_50s_linear_infinite]" />
          <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-dashed border-accent/20 animate-[spin_30s_linear_infinite_reverse]" />

          {/* Core Central Identity Anchor: HENIL */}
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#080A10] border border-accent/60 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_35px_rgba(0,240,255,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mb-1 animate-pulse" />
            <span className="font-editorial text-sm font-extrabold tracking-wider uppercase text-foreground">
              HENIL
            </span>
            <span className="font-mono text-[7px] text-accent tracking-widest uppercase">
              AXIS CORE
            </span>
          </div>

          {/* Cardinal Directional Dimension Nodes */}
          {CARDINAL_DIMENSIONS.map((dim) => {
            const isSelected = currentDim.id === dim.id;

            // Compute CSS translated position based on cardinal position
            let positionClasses = '';
            if (dim.position === 'top') positionClasses = '-top-1 sm:-top-2 left-1/2 -translate-x-1/2';
            if (dim.position === 'bottom') positionClasses = '-bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2';
            if (dim.position === 'left') positionClasses = 'top-1/2 -left-1 sm:-left-2 -translate-y-1/2';
            if (dim.position === 'right') positionClasses = 'top-1/2 -right-1 sm:-right-2 -translate-y-1/2';

            return (
              <div key={dim.id} className={`absolute z-20 ${positionClasses}`}>
                <InteractiveCursorTarget cursorType="interactive">
                  <button
                    type="button"
                    onClick={() => handleSelectDimension(dim)}
                    onMouseEnter={() => handleSelectDimension(dim)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border font-mono text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap cursor-pointer backdrop-blur-md shadow-md ${
                      isSelected
                        ? 'border-accent bg-accent/20 text-accent shadow-[0_0_20px_rgba(0,240,255,0.35)] scale-110 font-bold'
                        : 'border-border/80 bg-background/90 text-foreground-secondary hover:border-accent/60 hover:text-foreground'
                    }`}
                  >
                    <span>{dim.category}</span>
                  </button>
                </InteractiveCursorTarget>
              </div>
            );
          })}
        </div>

        {/* Right: Spatial Typography & Supporting Information Inspector */}
        <div className="lg:col-span-6 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDim.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="border border-accent/40 bg-background-surface/80 p-6 sm:p-8 space-y-6 relative shadow-[0_0_30px_rgba(0,240,255,0.03)]"
            >
              {/* Corner framing brackets */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-accent" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-accent" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-accent" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-accent" />

              <div className="flex items-center justify-between pb-3 border-b border-border/40 font-mono text-[10px] tracking-widest text-foreground-muted uppercase">
                <span className="text-accent font-semibold">
                  DIMENSION // {currentDim.code} · {currentDim.category}
                </span>
                <Badge variant="accent" className="text-[8px] uppercase">
                  ACTIVE EXPLORATION
                </Badge>
              </div>

              {/* Monumental Tagline */}
              <div>
                <span className="font-mono text-[9px] text-accent uppercase tracking-widest block mb-2">
                  ARCHITECTURAL THESIS
                </span>
                <h3 className="font-editorial text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-foreground leading-snug">
                  {currentDim.tagline}
                </h3>
              </div>

              {/* Spatial Manifesto Lines */}
              <div className="space-y-2 pt-2 border-t border-border/30">
                <span className="font-mono text-[9px] text-foreground-muted uppercase tracking-widest block mb-2">
                  CORE PRACTICES & ATTRIBUTES
                </span>
                <div className="space-y-1.5">
                  {currentDim.spatialManifesto.map((line, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 font-mono text-xs text-foreground-secondary"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Technologies */}
              <div className="pt-2">
                <span className="font-mono text-[9px] text-foreground-muted uppercase tracking-widest block mb-2">
                  APPLIED RUNTIMES & TOOLS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentDim.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[11px] font-mono border border-border bg-background text-foreground tracking-wider uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Learning Loop */}
              <div className="pt-3 border-t border-border/30 text-[11px] font-mono text-foreground-muted flex items-baseline gap-2">
                <span className="text-accent uppercase tracking-wider">LEARNING LOOP:</span>
                <span className="text-foreground-secondary">{currentDim.learningFocus}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quick Switch Buttons for Touch / Mobile Accessibility */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {CARDINAL_DIMENSIONS.map((dim) => {
              const isSelected = currentDim.id === dim.id;
              return (
                <button
                  key={dim.id}
                  type="button"
                  onClick={() => handleSelectDimension(dim)}
                  className={`p-2.5 border font-mono text-[9px] uppercase tracking-wider text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-accent bg-accent/15 text-accent font-bold'
                      : 'border-border/60 bg-background/40 text-foreground-muted hover:border-border hover:text-foreground'
                  }`}
                >
                  <div className="opacity-60 text-[8px]">0{dim.code}</div>
                  <div>{dim.category}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
