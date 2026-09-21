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

  const { isMobile } = useViewport();
  const { scrollTo } = useLenisScroll();

  // Scroll Timeline Listener for Opening Sequence (400vh track)
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

  const handleSkipExperience = () => {
    scrollTo('#about', { duration: 1.2 });
  };

  return (
    <div
      ref={containerRef}
      id="hero"
      className="relative w-full h-[400vh] bg-background text-foreground select-none"
    >
      {/* Sticky Full-Viewport Film Environment */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between">
        {/* =========================================================
            3D WEBGL ENGINE: MASTER PARTICLE MATTER & CAMERA
        ========================================================= */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <SceneCanvas
            cameraPosition={[0, 0, 8.5]}
            fov={isMobile ? 55 : 45}
            interactive={true}
            className="w-full h-full"
          >
            <CinematicOpening3D progress={progress} />
          </SceneCanvas>
        </div>

        {/* Top Minimal State & Skip Header */}
        <div className="relative z-20 w-full px-6 pt-6 sm:px-12 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-foreground-muted">
              {progress < 0.08
                ? 'DORMANT'
                : progress < 0.20
                ? 'PARTICLE FIELD'
                : progress < 0.42
                ? 'CONSTRUCTING'
                : progress < 0.55
                ? 'PHYSICAL TYPOGRAPHY'
                : progress < 0.68
                ? 'IDENTITY BREAK'
                : progress < 0.80
                ? 'SPATIAL IDENTITY'
                : progress < 0.92
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
            MINIMALIST SPATIAL EDITORIAL ANNOTATIONS (15% Text Budget)
        ========================================================= */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-6 sm:px-12 pointer-events-none">
          {/* -------------------------------------------------------
              SCENE 00: DORMANT (0.00 – 0.08)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress < 0.08 && (
              <motion.div
                key="scene-dormant"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-center space-y-2 pointer-events-none"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-foreground-muted animate-pulse">
                  INITIALIZING
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              SCENE 01: PARTICLE FIELD (0.08 – 0.20)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.08 && progress < 0.20 && (
              <motion.div
                key="scene-field"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-1 pointer-events-none"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-foreground-muted">
                  MATTER CONVERGING
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              SCENE 02 & 03: PHYSICAL HENIL PATEL (0.20 – 0.55)
              (NO HTML HEADING: THE 3D WEBGL PARTICLE SYSTEM IS THE NAME)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.35 && progress < 0.55 && (
              <motion.div
                key="scene-typography"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="absolute bottom-16 sm:bottom-20 text-center pointer-events-none space-y-2"
              >
                <p className="font-mono text-xs sm:text-sm tracking-widest uppercase text-accent font-medium">
                  COMPUTER ENGINEERING · AI · SYSTEMS · CREATIVE
                </p>
                <span className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase block animate-pulse">
                  MOVE CURSOR TO INTERACT WITH MATTER · SCROLL TO FRACTURE ↓
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              SCENE 04: IDENTITY BREAK (0.55 – 0.68)
              (Pure visual event, screen remains densely occupied)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.55 && progress < 0.68 && (
              <motion.div
                key="scene-break"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center pointer-events-none"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-foreground-muted">
                  STRUCTURAL INSTABILITY // PARTICLES DISPERSING
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              SCENE 05: SPATIAL IDENTITY (0.68 – 0.80)
              (4 Spatial territories in 3D, NO card grids)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.68 && progress < 0.80 && (
              <motion.div
                key="scene-spatial"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-5xl h-[70vh] flex flex-col justify-between pointer-events-none"
              >
                {/* Top spatial coordinates */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-[#00F0FF] tracking-wider uppercase block">
                      ENGINEERING
                    </span>
                    <p className="font-sans text-xs text-foreground-secondary italic">
                      "I build things."
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="font-mono text-xs font-bold text-[#38BDF8] tracking-wider uppercase block">
                      AI & COGNITION
                    </span>
                    <p className="font-sans text-xs text-foreground-secondary italic">
                      "I explore what they can become."
                    </p>
                  </div>
                </div>

                {/* Central Anchor */}
                <div className="text-center my-auto">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-accent font-semibold block">
                    SPATIAL TAXONOMY // CORE AXIS
                  </span>
                  <span className="font-editorial text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground">
                    Four Spatial Pillars
                  </span>
                </div>

                {/* Bottom spatial coordinates */}
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-[#EC4899] tracking-wider uppercase block">
                      CREATIVE
                    </span>
                    <p className="font-sans text-xs text-foreground-secondary italic">
                      "I care how they feel."
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="font-mono text-xs font-bold text-[#818CF8] tracking-wider uppercase block">
                      SYSTEMS
                    </span>
                    <p className="font-sans text-xs text-foreground-secondary italic">
                      "I connect the pieces."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              SCENE 06: TECHNOLOGY NETWORK (0.80 – 0.92)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.80 && progress < 0.92 && (
              <motion.div
                key="scene-network"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="text-center max-w-xl space-y-3 pointer-events-none"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-accent font-semibold">
                  TOPOLOGICAL BRIDGE
                </span>
                <h2 className="font-sans text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground">
                  Technology Network
                </h2>
                <div className="flex flex-wrap justify-center gap-2 pt-1 font-mono text-[10px] text-foreground-secondary uppercase tracking-wider">
                  <span>● AI / LLM / AGENTS</span>
                  <span>● DISTRIBUTED SYSTEMS</span>
                  <span>● SPATIAL WEBGL</span>
                  <span>● SECURITY</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -------------------------------------------------------
              SCENE 07: HENEOXY EMERGENCE (0.92 – 1.00)
          ------------------------------------------------------- */}
          <AnimatePresence>
            {progress >= 0.92 && (
              <motion.div
                key="scene-heneoxy"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.35 }}
                className="text-center max-w-2xl space-y-3 pointer-events-none"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-accent font-bold block">
                  FLAGSHIP WORLD // EMERGENCE
                </span>
                <h2 className="font-sans text-5xl sm:text-7xl font-extrabold uppercase tracking-tightest leading-none text-foreground drop-shadow-[0_0_35px_rgba(0,240,255,0.35)]">
                  HENEOXY
                </h2>
                <p className="font-mono text-xs tracking-widest uppercase text-foreground-secondary">
                  AI-POWERED PERSONAL COMPUTING ENVIRONMENT
                </p>
                <div className="pt-2 font-mono text-[10px] text-accent tracking-widest uppercase animate-pulse">
                  CONTINUE TO ENTER UNIVERSE ↓
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Coordinate Indicator */}
        <div className="relative z-20 w-full px-6 pb-6 sm:px-12 flex items-center justify-between pointer-events-none font-mono text-[10px] text-foreground-muted">
          <span>COORDINATE: [0.00, 0.00, {(8.5 - progress * 4.5).toFixed(2)}]</span>
          <span className="hidden sm:inline">TIMELINE REVERSIBLE ↕</span>
        </div>
      </div>
    </div>
  );
};

export default CinematicOpeningExperience;
