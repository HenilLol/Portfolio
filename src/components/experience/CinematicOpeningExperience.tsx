import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneCanvas } from '@/components/3d/SceneCanvas';
import { CinematicOpening3D } from '@/components/3d/CinematicOpening3D';
import { useViewport } from '@/hooks/useViewport';
import { useLenisScroll } from '@/hooks/useLenisScroll';

export interface CinematicOpeningExperienceProps {
  onComplete?: () => void;
}

export const CinematicOpeningExperience: React.FC<CinematicOpeningExperienceProps> = ({
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [activeDimension, setActiveDimension] = useState<string>('engineering');

  const { isMobile } = useViewport();
  const { scrollTo } = useLenisScroll();

  // Scroll Timeline Listener for Opening Sequence
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

      if (clampedProgress >= 0.98 && onComplete) {
        onComplete();
      }
    };

    const loop = () => {
      handleScroll();
      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animFrameId);
  }, [onComplete]);

  // Dimension details for Scene D (Spatial Identity) per V5 spec
  const DIMENSIONS_DATA: Record<string, { title: string; statement: string; color: string }> = {
    engineering: {
      title: 'ENGINEERING',
      statement: 'I build things.',
      color: '#00F0FF',
    },
    ai: {
      title: 'AI',
      statement: 'I explore what they can become.',
      color: '#38BDF8',
    },
    systems: {
      title: 'SYSTEMS',
      statement: 'I connect the pieces.',
      color: '#818CF8',
    },
    creative: {
      title: 'CREATIVE',
      statement: 'I care how they feel.',
      color: '#EC4899',
    },
  };

  const handleSkipExperience = () => {
    scrollTo('#about', { duration: 1.2 });
  };

  return (
    <div
      ref={containerRef}
      id="hero"
      className="relative w-full h-[360vh] bg-background text-foreground select-none"
    >
      {/* Sticky Full-Viewport Film Environment */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between">
        {/* =========================================================
            3D WEBGL ENGINE: MASTER PARTICLE & CAMERA CHOREOGRAPHY
        ========================================================= */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <SceneCanvas
            cameraPosition={[0, 0, 7.5]}
            fov={isMobile ? 55 : 45}
            interactive={true}
            className="w-full h-full"
          >
            <CinematicOpening3D progress={progress} />
          </SceneCanvas>
        </div>

        {/* Top Minimal Ambient Header Overlay */}
        <div className="relative z-20 w-full px-6 pt-6 sm:px-12 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-foreground-muted">
              {progress < 0.1
                ? 'DORMANT'
                : progress < 0.34
                ? 'IDENTITY'
                : progress < 0.52
                ? 'BREAK'
                : progress < 0.7
                ? 'SPATIAL IDENTITY'
                : progress < 0.86
                ? 'TECH NETWORK'
                : 'HENEOXY EMERGENCE'}
            </span>
          </div>

          {/* Skip Experience Accessibility Button */}
          <button
            type="button"
            onClick={handleSkipExperience}
            className="pointer-events-auto font-mono text-[10px] text-foreground-muted hover:text-accent tracking-widest uppercase transition-colors px-2 py-1 rounded border border-transparent hover:border-border/60"
            aria-label="Skip cinematic opening sequence"
          >
            SKIP EXPERIENCE ↓
          </button>
        </div>

        {/* =========================================================
            SYNCHRONIZED MINIMALIST SPATIAL DOM OVERLAYS (15% Text Budget)
        ========================================================= */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-6 sm:px-12 pointer-events-none">
          {/* -------------------------------------------------------
              SCENE A: DORMANT (0.00 – 0.10)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress < 0.1 && (
              <motion.div
                key="scene-dormant"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-2 pointer-events-none"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-foreground-muted animate-pulse">
                  INITIALIZING
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              SCENE B: HENIL PATEL IDENTITY CONSTRUCTION (0.10 – 0.34)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.1 && progress < 0.34 && (
              <motion.div
                key="scene-identity"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1 - (progress - 0.1) * 0.3,
                }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-4xl space-y-4 pointer-events-auto"
              >
                <div className="space-y-2">
                  <h1 className="font-sans text-5xl sm:text-7xl lg:text-9xl font-extrabold uppercase tracking-tightest leading-none text-foreground drop-shadow-2xl">
                    HENIL PATEL
                  </h1>
                  <p className="font-mono text-xs sm:text-sm tracking-widest uppercase text-accent font-medium">
                    COMPUTER ENGINEERING · AI · SYSTEMS · CREATIVE
                  </p>
                </div>

                <div className="pt-6 font-mono text-[10px] tracking-widest uppercase text-foreground-muted animate-pulse">
                  SCROLL TO ENTER EXPERIENCE ↓
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              SCENE C: IDENTITY BREAK / DECONSTRUCTION (0.34 – 0.52)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.34 && progress < 0.52 && (
              <motion.div
                key="scene-break"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 0.85, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-2 pointer-events-none"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-foreground-muted block">
                  PHYSICAL DECONSTRUCTION
                </span>
                <p className="font-mono text-xs text-foreground-secondary tracking-widest uppercase">
                  Fracturing typography into fundamental coordinates
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              SCENE D: SPATIAL IDENTITY CONSTELLATION (0.52 – 0.70)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.52 && progress < 0.7 && (
              <motion.div
                key="scene-spatial"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl flex flex-col justify-between h-[65vh] pointer-events-auto"
              >
                <div className="text-center space-y-1">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-accent font-semibold">
                    SPATIAL IDENTITY // FOUR PILLARS
                  </span>
                  <h2 className="font-sans text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground">
                    Dimensions of Practice
                  </h2>
                </div>

                {/* 4 Spatial Pillars around the 3D space */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-auto">
                  {Object.entries(DIMENSIONS_DATA).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveDimension(key)}
                      onMouseEnter={() => setActiveDimension(key)}
                      className={`p-3 sm:p-4 text-left transition-all cursor-pointer rounded border ${
                        activeDimension === key
                          ? 'border-accent bg-background/80 shadow-[0_0_20px_rgba(0,240,255,0.12)]'
                          : 'border-border/40 bg-background/40 hover:border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="font-mono text-xs font-bold tracking-wider uppercase"
                          style={{ color: item.color }}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            activeDimension === key ? 'bg-accent' : 'bg-border'
                          }`}
                        />
                      </div>
                      <p className="font-sans text-xs text-foreground-secondary italic">
                        "{item.statement}"
                      </p>
                    </button>
                  ))}
                </div>

                {/* Minimal Selected Spotlight */}
                <div className="text-center border-t border-border/30 pt-3">
                  <span className="font-mono text-[11px] text-accent tracking-widest uppercase font-semibold">
                    {DIMENSIONS_DATA[activeDimension]?.title}: {DIMENSIONS_DATA[activeDimension]?.statement}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              SCENE E: TECHNOLOGY NETWORK (0.70 – 0.86)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.7 && progress < 0.86 && (
              <motion.div
                key="scene-network"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-2xl space-y-4 pointer-events-auto"
              >
                <div className="space-y-1">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-accent font-semibold">
                    TOPOLOGICAL BRIDGE
                  </span>
                  <h2 className="font-sans text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-foreground">
                    Technology Network
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-foreground-secondary max-w-lg mx-auto">
                    Connecting personal craft, autonomous AI systems, and high-throughput infrastructure.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {[
                    'AI · LLM · AGENTS',
                    'SYSTEMS · PYTHON',
                    'WEB · SQL · SHADERS',
                    'SECURITY · TELEMETRY',
                  ].map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 border border-border/60 bg-background/50 font-mono text-[10px] text-accent uppercase tracking-wider"
                    >
                      ● {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              SCENE F: HENEOXY EMERGENCE (0.86 – 1.00)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.86 && (
              <motion.div
                key="scene-heneoxy"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-3xl space-y-4 pointer-events-auto"
              >
                <div className="space-y-2">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-accent font-bold block">
                    FLAGSHIP SYSTEM // EMERGENCE
                  </span>
                  <h2 className="font-sans text-5xl sm:text-7xl font-extrabold uppercase tracking-tightest leading-none text-foreground drop-shadow-[0_0_35px_rgba(0,240,255,0.3)]">
                    HENEOXY
                  </h2>
                  <p className="font-mono text-xs sm:text-sm tracking-widest uppercase text-foreground-secondary">
                    AI-POWERED PERSONAL COMPUTING ENVIRONMENT
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => scrollTo('#about', { duration: 1.2 })}
                    className="px-6 py-2.5 bg-accent text-background font-mono text-xs uppercase tracking-wider font-bold hover:bg-accent-secondary transition-colors cursor-pointer"
                  >
                    CONTINUE THROUGH UNIVERSE ↓
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Coordinate Indicator */}
        <div className="relative z-20 w-full px-6 pb-6 sm:px-12 flex items-center justify-between pointer-events-none font-mono text-[10px] text-foreground-muted">
          <span>COORDINATE: [0.00, 0.00, {(7.5 - progress * 3.5).toFixed(2)}]</span>
          <span className="hidden sm:inline">TIMELINE REVERSIBLE ↕</span>
        </div>
      </div>
    </div>
  );
};

export default CinematicOpeningExperience;
