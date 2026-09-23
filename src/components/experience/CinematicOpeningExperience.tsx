import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { CinematicOpening3D } from "@/components/3d/CinematicOpening3D";
import { useViewport } from "@/hooks/useViewport";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface CinematicOpeningExperienceProps {
  onComplete?: () => void;
}

// Progress threshold at which HENIL PATEL is fully formed and we apply the hold
const HENIL_PATEL_HOLD_ENTRY = 0.42;
const HENIL_PATEL_HOLD_EXIT = 0.52;
const HENIL_PATEL_HOLD_DURATION_MS = 2000;

export const CinematicOpeningExperience: React.FC<CinematicOpeningExperienceProps> = ({
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // displayProgress is what gets rendered � it lerps toward rawProgress
  const [displayProgress, setDisplayProgress] = useState<number>(0);

  // Internal refs (no re-render overhead)
  const displayProgressRef = useRef<number>(0);

  // HENIL PATEL hold state � stored in refs to avoid stale closure issues
  const holdActiveRef = useRef<boolean>(false);
  const holdStartTimeRef = useRef<number | null>(null);
  const holdTriggeredRef = useRef<boolean>(false);

  const { isMobile, width: viewportWidth } = useViewport();
  const { scrollTo } = useLenisScroll();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let animFrameId: number;

    const handleFrame = (timestamp: number) => {
      if (!containerRef.current) {
        animFrameId = requestAnimationFrame(handleFrame);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const trackHeight = containerRef.current.offsetHeight;
      const pinnedTravel = trackHeight - viewportHeight;

      if (pinnedTravel <= 0) {
        animFrameId = requestAnimationFrame(handleFrame);
        return;
      }

      const currentScroll = -rect.top;

      let calculatedProgress: number;
      if (currentScroll <= 0) {
        calculatedProgress = 0;
      } else if (currentScroll <= pinnedTravel) {
        calculatedProgress = (currentScroll / pinnedTravel) * 0.95;
      } else {
        const unpinScroll = currentScroll - pinnedTravel;
        calculatedProgress = 0.95 + (unpinScroll / viewportHeight) * 0.05;
      }

      const clampedRaw = Math.max(0, Math.min(1, calculatedProgress));

      // HENIL PATEL 2-SECOND CINEMATIC HOLD (mobile only, skip for reduced-motion)
      let effectiveProgress = clampedRaw;

      if (isMobile && !reducedMotion) {
        const prev = displayProgressRef.current;

        if (
          !holdTriggeredRef.current &&
          clampedRaw >= HENIL_PATEL_HOLD_ENTRY &&
          clampedRaw < HENIL_PATEL_HOLD_EXIT &&
          prev < HENIL_PATEL_HOLD_ENTRY
        ) {
          holdActiveRef.current = true;
          holdStartTimeRef.current = timestamp;
          holdTriggeredRef.current = true;
        }

        if (clampedRaw < HENIL_PATEL_HOLD_ENTRY - 0.02) {
          holdTriggeredRef.current = false;
          holdActiveRef.current = false;
          holdStartTimeRef.current = null;
        }

        if (holdActiveRef.current && holdStartTimeRef.current !== null) {
          const elapsed = timestamp - holdStartTimeRef.current;
          if (elapsed < HENIL_PATEL_HOLD_DURATION_MS) {
            effectiveProgress = HENIL_PATEL_HOLD_ENTRY;
          } else {
            holdActiveRef.current = false;
          }
        }
      }

      // Cinematic progress smoothing: lerp displayProgress toward effectiveProgress
      // Factor 0.07 at ~60fps gives ~300ms smooth lag; reducedMotion snaps immediately
      const lerpFactor = reducedMotion ? 1.0 : 0.07;
      const newDisplay =
        displayProgressRef.current +
        (effectiveProgress - displayProgressRef.current) * lerpFactor;
      displayProgressRef.current = newDisplay;

      setDisplayProgress(newDisplay);

      if (newDisplay >= 0.98 && onComplete) {
        onComplete();
      }

      animFrameId = requestAnimationFrame(handleFrame);
    };

    animFrameId = requestAnimationFrame(handleFrame);
    return () => cancelAnimationFrame(animFrameId);
  }, [onComplete, isMobile, reducedMotion]);

  const handleSkipExperience = useCallback(() => {
    scrollTo("#about", { duration: 1.2 });
  }, [scrollTo]);

  const progress = displayProgress;

  return (
    <div
      ref={containerRef}
      id="hero"
      className="relative w-full h-[400vh] bg-background text-foreground select-none"
    >
      {/* Sticky Full-Viewport Film Environment */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-x-clip overflow-y-visible flex flex-col justify-between">
        {/* 3D WEBGL ENGINE */}
        <div
          className="absolute top-0 left-0 right-0 h-[100vh] sm:h-[135vh] z-0 pointer-events-none"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
          }}
        >
          <SceneCanvas
            cameraPosition={[0, 0, 8.5]}
            fov={isMobile ? 55 : 45}
            interactive={true}
            className="w-full h-full"
          >
            <CinematicOpening3D
              progress={progress}
              viewportWidth={viewportWidth}
            />
          </SceneCanvas>
        </div>

        {/* Top Minimal State & Skip Header */}
        <div
          className="relative z-20 w-full px-6 pt-6 sm:px-12 flex items-center justify-between pointer-events-none transition-opacity duration-300"
          style={{
            opacity:
              progress >= 0.88
                ? Math.max(0, 1 - (progress - 0.88) / 0.06)
                : 1,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-foreground-muted">
              {progress < 0.08
                ? "DORMANT"
                : progress < 0.2
                ? "PARTICLE FIELD"
                : progress < 0.42
                ? "CONSTRUCTING"
                : progress < 0.55
                ? "PHYSICAL TYPOGRAPHY"
                : progress < 0.68
                ? "IDENTITY BREAK"
                : progress < 0.78
                ? "SPATIAL IDENTITY"
                : progress < 0.88
                ? "TECH NETWORK"
                : progress < 0.96
                ? "HENEOXY EMERGENCE"
                : "PORTFOLIO HANDOVER"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSkipExperience}
            className="pointer-events-auto font-mono text-[10px] text-foreground-muted hover:text-accent tracking-widest uppercase transition-colors px-2 py-1 rounded border border-transparent hover:border-border/60"
            aria-label="Skip cinematic opening sequence"
          >
            SKIP EXPERIENCE
          </button>
        </div>

        {/* SPATIAL EDITORIAL ANNOTATIONS */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-6 sm:px-12 pointer-events-none">
          {/* SCENE 00: DORMANT */}
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

          {/* SCENE 01: PARTICLE FIELD */}
          <AnimatePresence>
            {progress >= 0.08 && progress < 0.2 && (
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

          {/* SCENE 02 & 03: PHYSICAL HENIL PATEL */}
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
                  MOVE CURSOR TO INTERACT WITH MATTER · SCROLL TO FRACTURE
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SCENE 04: IDENTITY BREAK */}
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

          {/* SCENE 05: SPATIAL IDENTITY */}
          <AnimatePresence>
            {progress >= 0.68 && progress < 0.78 && (
              <motion.div
                key="scene-spatial"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-5xl h-[70vh] flex flex-col justify-between pointer-events-none"
              >
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
                      AI &amp; COGNITION
                    </span>
                    <p className="font-sans text-xs text-foreground-secondary italic">
                      "I explore what they can become."
                    </p>
                  </div>
                </div>

                <div className="text-center my-auto">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-accent font-semibold block">
                    SPATIAL TAXONOMY // CORE AXIS
                  </span>
                  <span className="font-editorial text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground">
                    Four Spatial Pillars
                  </span>
                </div>

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

          {/* SCENE 06: TECHNOLOGY NETWORK */}
          <AnimatePresence>
            {progress >= 0.78 && progress < 0.88 && (
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

          {/* SCENE 07: HENEOXY EMERGENCE & HANDOVER */}
          <AnimatePresence>
            {progress >= 0.88 && (
              <motion.div
                key="scene-heneoxy"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{
                  opacity:
                    progress > 0.98
                      ? Math.max(0, 1 - (progress - 0.98) * 50)
                      : 1,
                  scale: 1,
                }}
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
                  {progress < 0.96
                    ? "CONTINUE TO ENTER UNIVERSE"
                    : "ENTERING PORTFOLIO SPACE"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HUD text (COORDINATE / TIMELINE REVERSIBLE) has been intentionally removed */}
      </div>
    </div>
  );
};

export default CinematicOpeningExperience;
