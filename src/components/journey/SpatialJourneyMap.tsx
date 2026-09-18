import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Badge } from '@/components/ui/Badge';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';

export interface JourneyMilestone {
  id: string;
  year: string;
  period: string;
  title: string;
  category: 'ACADEMIC' | 'FOUNDATIONS' | 'CREATIVE TECH' | 'AI SYSTEMS' | 'DOMAIN TELEMETRY' | 'CURRENT HORIZON';
  summary: string;
  milestones: string[];
  technologies: string[];
  status: 'FOUNDATION' | 'CORE PRACTICE' | 'ACTIVE DEVELOPMENT' | 'PRESENT HORIZON';
  coordinates: { x: number; y: number }; // 0-100 canvas position for spatial path
}

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    id: 'm-2024-foundations',
    year: '2024',
    period: 'EARLY 2024',
    title: 'Computational Foundations & Systems Engineering',
    category: 'FOUNDATIONS',
    summary:
      'Underpinning software development with deep computer engineering principles: memory allocation, data structures, algorithmic complexity, and Linux runtimes.',
    milestones: [
      'B.Tech Computer Engineering core curriculum',
      'C / C++ memory layout & data structure implementations',
      'POSIX shell scripting & terminal developer environments',
    ],
    technologies: ['C / C++', 'Linux / Bash', 'Data Structures', 'Git'],
    status: 'FOUNDATION',
    coordinates: { x: 12, y: 30 },
  },
  {
    id: 'm-2024-web',
    year: '2024–2025',
    period: 'MID 2024 – LATE 2024',
    title: 'Modern Frontend Architecture & Type Systems',
    category: 'ACADEMIC',
    summary:
      'Transitioning to strict TypeScript, React component lifecycles, CSS Grid systems, and deterministic client-side state management.',
    milestones: [
      'Strict TypeScript architecture & custom React hook patterns',
      'Utility-first token systems & dark mode palette architectures',
      'Accessible semantic HTML trees & responsive fluid layouts',
    ],
    technologies: ['TypeScript', 'React', 'Tailwind CSS', 'Vite'],
    status: 'CORE PRACTICE',
    coordinates: { x: 28, y: 70 },
  },
  {
    id: 'm-2025-creative',
    year: '2025',
    period: 'EARLY 2025',
    title: 'Interactive 3D Graphics & Motion Choreography',
    category: 'CREATIVE TECH',
    summary:
      'Advancing into creative technology: WebGL shaders, Three.js buffer geometry, and timeline-orchestrated scroll physics.',
    milestones: [
      'Three.js perspective cameras & procedural starfield renderers',
      'GSAP ScrollTrigger time-scrubbed choreography',
      'GLSL procedural fragment mathematics & lens flare shaders',
    ],
    technologies: ['Three.js', 'WebGL / GLSL', 'GSAP', 'Motion'],
    status: 'CORE PRACTICE',
    coordinates: { x: 48, y: 25 },
  },
  {
    id: 'm-2025-ai',
    year: '2025',
    period: 'MID 2025',
    title: 'Intelligent Agentic Systems & Spatial Computing',
    category: 'AI SYSTEMS',
    summary:
      'Inception and architectural design of HENEOXY: autonomous multi-turn agent loops, context engineering, and local model tooling.',
    milestones: [
      'HENEOXY flagship architecture & subsystem OS design',
      'Structured tool-calling schemas & agent memory pipelines',
      'Model Context Protocol (MCP) local environment integrations',
    ],
    technologies: ['LLM Tooling', 'Prompt Engineering', 'MCP', 'Agent Architecture'],
    status: 'ACTIVE DEVELOPMENT',
    coordinates: { x: 68, y: 75 },
  },
  {
    id: 'm-2025-telemetry',
    year: '2025–2026',
    period: 'LATE 2025 – EARLY 2026',
    title: 'High-Throughput Domain Telemetry Systems',
    category: 'DOMAIN TELEMETRY',
    summary:
      'Engineering domain-specific intelligence: AeroIndex India for aviation flight vectors and COALINTEL for geological compliance reporting.',
    milestones: [
      'AeroIndex India navigation radar & vector math visualizations',
      'COALINTEL mining document verification & evidence validation chains',
      'Architectural Blueprint CAD visualization engine',
    ],
    technologies: ['Data Pipelines', 'Vector Mathematics', 'Telemetry UI', 'PostgreSQL'],
    status: 'ACTIVE DEVELOPMENT',
    coordinates: { x: 84, y: 35 },
  },
  {
    id: 'm-2026-present',
    year: '2026',
    period: 'PRESENT',
    title: 'Continuous Creative Technologist Practice',
    category: 'CURRENT HORIZON',
    summary:
      'Synthesizing rigorous software engineering with cinematic digital design. B.Tech Computer Engineering candidate building purposeful digital environments.',
    milestones: [
      'Continuous refinement of personal systems & portfolio architecture',
      'Open experimentation in WebGL shaders & agentic automation',
      'Pursuit of engineering excellence with truthful communication',
    ],
    technologies: ['Systems Engineering', 'Creative Direction', 'WebGL', 'TypeScript'],
    status: 'PRESENT HORIZON',
    coordinates: { x: 95, y: 65 },
  },
];

export const SpatialJourneyMap: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('m-2026-present');

  const currentMilestone =
    JOURNEY_MILESTONES.find((m) => m.id === selectedId) ||
    JOURNEY_MILESTONES[JOURNEY_MILESTONES.length - 1];

  return (
    <div className="relative w-full border border-border/80 bg-background-surface/40 backdrop-blur-md p-6 sm:p-10 lg:p-12 space-y-10 overflow-hidden select-none group">
      {/* Precision Background Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40 font-mono text-[10px] tracking-widest uppercase text-foreground-muted">
        <div className="flex items-center gap-3">
          <TechnicalLabel indicator indicatorColor="accent">
            JOURNEY ARCHIVE // 2024 → 2026
          </TechnicalLabel>
          <span className="text-border">/</span>
          <span className="text-accent">EVOLUTION TIMELINE</span>
        </div>
        <div className="flex items-center gap-3 text-[9px]">
          <span>FOCUSED: {currentMilestone.year}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        </div>
      </div>

      {/* Desktop Spatial Trajectory Map (>= 1024px) */}
      <div className="hidden lg:block relative h-64 border border-border/50 bg-[#06080E]/70 p-6 overflow-hidden">
        {/* SVG Spatial Path linking the milestones in chronological curve */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 240" fill="none">
          {/* Baseline faint path */}
          <path
            d="M 120 72 Q 200 168, 280 168 T 480 60 T 680 180 T 840 84 T 950 156"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Active illuminated path gradient */}
          <path
            d="M 120 72 Q 200 168, 280 168 T 480 60 T 680 180 T 840 84 T 950 156"
            stroke="url(#journey-path-gradient)"
            strokeWidth="2"
          />

          <defs>
            <linearGradient id="journey-path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 240, 255, 0.2)" />
              <stop offset="50%" stopColor="rgba(0, 240, 255, 0.6)" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>
          </defs>
        </svg>

        {/* Milestone Interactive Point Anchors */}
        {JOURNEY_MILESTONES.map((milestone) => {
          const isSelected = selectedId === milestone.id;

          return (
            <div
              key={milestone.id}
              style={{
                position: 'absolute',
                left: `${milestone.coordinates.x}%`,
                top: `${milestone.coordinates.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="z-20"
            >
              <InteractiveCursorTarget cursorType="interactive">
                <button
                  type="button"
                  onClick={() => setSelectedId(milestone.id)}
                  onMouseEnter={() => setSelectedId(milestone.id)}
                  className={`group relative flex flex-col items-center cursor-pointer transition-all duration-300 p-2 ${
                    isSelected ? 'scale-125' : 'hover:scale-110 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Point Ring Halo */}
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/30 shadow-[0_0_15px_#00F0FF]'
                        : 'border-border bg-background hover:border-accent/60'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isSelected ? 'bg-accent' : 'bg-foreground-muted group-hover:bg-foreground'
                      }`}
                    />
                  </span>

                  {/* Year Tag Label */}
                  <span
                    className={`font-mono text-[9px] tracking-wider uppercase mt-1 px-1.5 py-0.5 rounded transition-colors ${
                      isSelected
                        ? 'text-accent bg-accent/10 border border-accent/40 font-semibold'
                        : 'text-foreground-muted group-hover:text-foreground'
                    }`}
                  >
                    {milestone.year}
                  </span>
                </button>
              </InteractiveCursorTarget>
            </div>
          );
        })}
      </div>

      {/* Selected Milestone Inspection Detail Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMilestone.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="border border-accent/40 bg-[#07090E]/90 p-6 sm:p-8 space-y-6 relative shadow-[0_0_30px_rgba(0,240,255,0.03)]"
        >
          {/* Decorative Corner Framing */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent" />

          {/* Header Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40 font-mono text-[10px] tracking-widest text-foreground-muted uppercase">
            <div className="flex items-center gap-3">
              <span className="text-accent font-semibold">{currentMilestone.period}</span>
              <span className="text-border">/</span>
              <span>{currentMilestone.category}</span>
            </div>
            <Badge variant="accent" className="text-[9px] uppercase tracking-wider w-fit">
              {currentMilestone.status}
            </Badge>
          </div>

          {/* Title & Summary */}
          <div className="space-y-2">
            <h4 className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
              {currentMilestone.title}
            </h4>
            <p className="text-foreground-secondary text-sm sm:text-base leading-relaxed max-w-3xl">
              {currentMilestone.summary}
            </p>
          </div>

          {/* Core Milestones Accomplished */}
          <div className="space-y-2 pt-2 border-t border-border/30">
            <span className="font-mono text-[9px] text-foreground-muted tracking-widest uppercase block mb-2">
              REAL PROGRESS & MILESTONES
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentMilestone.milestones.map((item, i) => (
                <div
                  key={i}
                  className="p-3 border border-border/50 bg-background/50 font-mono text-xs text-foreground-secondary flex items-start gap-2"
                >
                  <span className="text-accent font-bold">0{i + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Applied Technologies */}
          <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <span className="text-foreground-muted uppercase tracking-widest mr-2">APPLIED TOOLS:</span>
            {currentMilestone.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 border border-border bg-background text-foreground tracking-wider uppercase"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile Stepper Selector (< 1024px) */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
        {JOURNEY_MILESTONES.map((milestone) => {
          const isSelected = selectedId === milestone.id;

          return (
            <button
              key={milestone.id}
              type="button"
              onClick={() => setSelectedId(milestone.id)}
              className={`px-3 py-2 border font-mono text-[10px] uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 ${
                isSelected
                  ? 'border-accent bg-accent/15 text-accent font-bold'
                  : 'border-border/60 bg-background/50 text-foreground-muted hover:border-border hover:text-foreground'
              }`}
            >
              {milestone.year}
            </button>
          );
        })}
      </div>
    </div>
  );
};
