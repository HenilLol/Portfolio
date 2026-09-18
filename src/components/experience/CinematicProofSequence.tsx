import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneCanvas } from '@/components/3d/SceneCanvas';
import { CinematicProofSequence3D } from '@/components/3d/CinematicProofSequence3D';
import { useViewport } from '@/hooks/useViewport';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';

interface CinematicProofSequenceProps {
  onSequenceComplete?: () => void;
}

export const CinematicProofSequence: React.FC<CinematicProofSequenceProps> = ({
  onSequenceComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [activeDimension, setActiveDimension] = useState<string>('engineering');
  const [activeHeneoxySubsystem, setActiveHeneoxySubsystem] = useState<string>('SYSTEM');

  const { isMobile } = useViewport();
  const { scrollTo } = useLenisScroll();

  // Scroll Timeline Listener
  useEffect(() => {
    let animFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (containerHeight <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = currentScroll / containerHeight;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));
      setProgress(clampedProgress);

      if (clampedProgress >= 0.98 && onSequenceComplete) {
        onSequenceComplete();
      }
    };

    const loop = () => {
      handleScroll();
      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animFrameId);
  }, [onSequenceComplete]);

  // Dimension details for Stage 3 (Constellation)
  const DIMENSIONS_INFO: Record<string, { title: string; desc: string; color: string }> = {
    engineering: {
      title: 'ENGINEERING',
      desc: 'Distributed systems, high-throughput pipelines, and robust fault-tolerant architecture.',
      color: '#00F0FF',
    },
    ai: {
      title: 'AI & COGNITION',
      desc: 'Multi-agent orchestration, contextual memory architectures, and autonomous decision graphs.',
      color: '#38BDF8',
    },
    systems: {
      title: 'SYSTEMS & TELEMETRY',
      desc: 'Sub-millisecond data pipelines, spatial coordinate engines, and infrastructure observability.',
      color: '#818CF8',
    },
    creative: {
      title: 'CREATIVE COMPUTING',
      desc: 'Custom WebGL shaders, kinetic physics, and interactive spatial digital experiences.',
      color: '#EC4899',
    },
  };

  // Subsystem descriptions for Stage 6 (HENEOXY)
  const HENEOXY_SUBSYSTEM_INFO: Record<string, string> = {
    SYSTEM: 'Kernel coordination, agent scheduler, and asynchronous message bus routing.',
    AGENTS: 'Autonomous worker hierarchy executing parallel contextual tasks and subgoals.',
    MEMORY: 'Episodic memory store with vector embeddings and fast semantic recall.',
    CONTEXT: 'Dynamic window synthesis compressing system state across execution boundaries.',
    TOOLS: 'Sandboxed capability primitives with strict permission enforcement.',
    SECURITY: 'Cryptographic boundary protection, token isolation, and anomaly detection.',
    ARCHITECTURE: 'Event-driven reactive topology connecting distributed neural nodes.',
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[550vh] bg-background text-foreground select-none"
    >
      {/* Sticky Full-Viewport Film Environment */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between">
        {/* =========================================================
            3D WEBGL ENGINE: MASTER PARTICLE & CAMERA CHOREOGRAPHY
        ========================================================= */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <SceneCanvas
            cameraPosition={[0, 0, 7.2]}
            fov={isMobile ? 55 : 45}
            interactive={true}
            className="w-full h-full"
          >
            <CinematicProofSequence3D
              progress={progress}
              activeDimension={activeDimension}
              activeHeneoxySubsystem={activeHeneoxySubsystem}
            />
          </SceneCanvas>
        </div>

        {/* Minimal Timeline Scrub Bar at Top */}
        <div className="relative z-20 w-full px-6 pt-6 sm:px-12 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-foreground-muted">
              {progress < 0.22
                ? '01 // IDENTITY'
                : progress < 0.36
                ? '02 // BREAK'
                : progress < 0.52
                ? '03 // CONSTELLATION'
                : progress < 0.68
                ? '04 // TECH NETWORK'
                : progress < 0.8
                ? '05 // COLLAPSE'
                : '06 // HENEOXY OS'}
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] text-foreground-muted">
            <span>TIMELINE: {Math.round(progress * 100)}%</span>
            <div className="w-24 h-1 bg-border/60 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-accent transition-all duration-75"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* =========================================================
            SYNCHRONIZED MINIMALIST SPATIAL DOM OVERLAYS
        ========================================================= */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-6 sm:px-12 pointer-events-none">
          {/* -------------------------------------------------------
              STAGE 1: DORMANT & HENIL PATEL (0.00 – 0.22)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress < 0.22 && (
              <motion.div
                key="stage-hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: progress > 0.04 ? 1 - (progress - 0.08) * 4 : 0.8,
                  y: 0,
                  scale: 1 - progress * 0.4,
                }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-4xl space-y-6 pointer-events-auto"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/30 bg-accent/5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="font-mono text-[10px] tracking-widest uppercase text-accent">
                    INTERACTIVE EXPERIENCE PROOF
                  </span>
                </div>

                <div className="space-y-2">
                  <h1 className="font-sans text-5xl sm:text-7xl lg:text-9xl font-extrabold uppercase tracking-tightest leading-none text-foreground drop-shadow-2xl">
                    HENIL PATEL
                  </h1>
                  <p className="font-sans text-base sm:text-xl font-light text-foreground-secondary tracking-wide max-w-xl mx-auto">
                    Software Engineer & Creative Technologist
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => scrollTo('#projects', { duration: 1.5 })}
                    className="px-6 py-2.5 bg-accent text-background font-mono text-xs uppercase tracking-wider font-bold hover:bg-accent-secondary transition-colors cursor-pointer"
                  >
                    EXPLORE WORLDS ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo('#contact', { duration: 1.8 })}
                    className="px-6 py-2.5 border border-border text-foreground font-mono text-xs uppercase tracking-wider hover:border-accent/60 transition-colors cursor-pointer"
                  >
                    INITIALIZE CONTACT
                  </button>
                </div>

                <div className="pt-8 font-mono text-[10px] tracking-widest uppercase text-foreground-muted animate-pulse">
                  SCRUB DOWN TO ACCELERATE TIMELINE ↓
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              STAGE 2: IDENTITY BREAKS & PARTICLES (0.22 – 0.36)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.22 && progress < 0.36 && (
              <motion.div
                key="stage-break"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-3 pointer-events-none"
              >
                <span className="font-mono text-[11px] tracking-widest uppercase text-accent font-semibold block">
                  STAGE 02 // PHYSICAL DECONSTRUCTION
                </span>
                <h2 className="font-sans text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-foreground">
                  IDENTITY DISSOLVING INTO FIELD
                </h2>
                <p className="font-mono text-xs text-foreground-secondary tracking-wide">
                  1,800 physical particles dispersing across 3D coordinate space.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              STAGE 3: IDENTITY CONSTELLATION (0.36 – 0.52)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.36 && progress < 0.52 && (
              <motion.div
                key="stage-constellation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-5xl flex flex-col justify-between h-[70vh] pointer-events-auto"
              >
                {/* Top Label */}
                <div className="text-center space-y-1">
                  <TechnicalLabel indicator indicatorColor="accent">
                    DIMENSIONS OF PRACTICE // 4 CARDINAL NODES
                  </TechnicalLabel>
                  <h2 className="font-sans text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground">
                    Four Spatial Pillars
                  </h2>
                </div>

                {/* 4 Cardinal Dimension Selector Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
                  {Object.entries(DIMENSIONS_INFO).map(([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveDimension(key)}
                      onMouseEnter={() => setActiveDimension(key)}
                      className={`p-4 border transition-all text-left space-y-2 cursor-pointer ${
                        activeDimension === key
                          ? 'border-accent bg-background/80 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                          : 'border-border/60 bg-background/40 hover:border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="font-mono text-xs font-bold tracking-wider"
                          style={{ color: val.color }}
                        >
                          {val.title}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            activeDimension === key ? 'bg-accent' : 'bg-border'
                          }`}
                        />
                      </div>
                      <p className="font-sans text-[11px] sm:text-xs text-foreground-secondary line-clamp-2">
                        {val.desc}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Active Dimension Spotlight Details */}
                <div className="text-center border-t border-border/40 pt-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-accent font-bold">
                    ACTIVE ARCHITECTURE: {DIMENSIONS_INFO[activeDimension]?.title}
                  </span>
                  <p className="font-sans text-xs sm:text-sm text-foreground-secondary max-w-lg mx-auto mt-1">
                    {DIMENSIONS_INFO[activeDimension]?.desc}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              STAGE 4: LIVING TECHNOLOGY NETWORK (0.52 – 0.68)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.52 && progress < 0.68 && (
              <motion.div
                key="stage-technet"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-3xl space-y-6 pointer-events-auto"
              >
                <div className="space-y-2">
                  <TechnicalLabel indicator indicatorColor="accent">
                    RELATIONAL TOPOLOGY // LIVING NETWORK
                  </TechnicalLabel>
                  <h2 className="font-sans text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-foreground">
                    Connected Technology Graph
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-foreground-secondary max-w-xl mx-auto">
                    The 4 dimensions dynamically branch into 16 specialized engineering hubs, powering real-world production systems.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {[
                    'MULTI-AGENT RUNTIMES',
                    'DISTRIBUTED TELEMETRY',
                    'SPATIAL WEBGL SHADERS',
                    'FULLSTACK CORE ENGINE',
                  ].map((label, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 border border-border/70 bg-background/60 font-mono text-[10px] text-accent tracking-wider uppercase"
                    >
                      ● {label}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              STAGE 5: NETWORK COLLAPSE / SINGULARITY (0.68 – 0.80)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.68 && progress < 0.8 && (
              <motion.div
                key="stage-collapse"
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-3 pointer-events-none"
              >
                <span className="font-mono text-xs tracking-widest uppercase text-accent font-bold animate-pulse">
                  CONVERGENCE // ACCELERATING VORTEX
                </span>
                <h2 className="font-sans text-3xl sm:text-6xl font-extrabold uppercase tracking-tight text-foreground drop-shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                  RECONFIGURING SYSTEM RUNTIME
                </h2>
                <p className="font-mono text-xs text-foreground-secondary tracking-widest uppercase">
                  Collapsing network geometry into core singularity...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              STAGE 6: HENEOXY FORMS & TAKES OVER (0.80 – 1.00)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.8 && (
              <motion.div
                key="stage-heneoxy"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-5xl flex flex-col justify-between h-[75vh] pointer-events-auto"
              >
                {/* Title & Headline */}
                <div className="space-y-2 border-b border-border/60 pb-4">
                  <div className="flex items-center justify-between">
                    <TechnicalLabel indicator indicatorColor="accent">
                      FLAGSHIP WORLD // SCENE-05
                    </TechnicalLabel>
                    <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-widest">
                      SYSTEM READY // 7 AGENTS ACTIVE
                    </span>
                  </div>
                  <h2 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tightest leading-none text-foreground">
                    HENEOXY
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-foreground-secondary max-w-xl">
                    Autonomous multi-agent runtime and spatial context engine with sub-surface execution channels.
                  </p>
                </div>

                {/* 7 Interactive Subsystem Controls */}
                <div className="space-y-3 my-auto">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
                    SELECT SUBSYSTEM NODE TO INTERROGATE ARCHITECTURE:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(HENEOXY_SUBSYSTEM_INFO).map((subKey) => (
                      <button
                        key={subKey}
                        type="button"
                        onClick={() => setActiveHeneoxySubsystem(subKey)}
                        className={`px-3 py-2 border font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                          activeHeneoxySubsystem === subKey
                            ? 'border-accent text-accent bg-accent/15 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                            : 'border-border/60 text-foreground-secondary hover:border-border'
                        }`}
                      >
                        [{subKey}]
                      </button>
                    ))}
                  </div>

                  {/* Subsystem Telemetry Card */}
                  <div className="p-4 border border-accent/40 bg-background/70 backdrop-blur-md rounded space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold block">
                      NODE: {activeHeneoxySubsystem} // EXECUTION LAYER
                    </span>
                    <p className="font-sans text-xs sm:text-sm text-foreground">
                      {HENEOXY_SUBSYSTEM_INFO[activeHeneoxySubsystem]}
                    </p>
                  </div>
                </div>

                {/* Bottom CTA Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60 pt-4">
                  <div className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase">
                    PROCEED DOWNWARD TO INTERROGATE SUBSEQUENT PROJECT WORLDS ↓
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollTo('#projects', { duration: 1.2 })}
                    className="w-full sm:w-auto px-6 py-2.5 bg-accent text-background font-mono text-xs uppercase tracking-wider font-bold hover:bg-accent-secondary transition-colors cursor-pointer"
                  >
                    CONTINUE TO PROJECT UNIVERSE ↗
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimal Bottom Spatial Indicator */}
        <div className="relative z-20 w-full px-6 pb-6 sm:px-12 flex items-center justify-between pointer-events-none font-mono text-[10px] text-foreground-muted">
          <span>COORDINATE: [0.00, 0.00, {(7.2 - progress * 3.4).toFixed(2)}]</span>
          <span className="animate-pulse">SCROLL REVERSIBLE ↕</span>
        </div>
      </div>
    </div>
  );
};

export default CinematicProofSequence;
