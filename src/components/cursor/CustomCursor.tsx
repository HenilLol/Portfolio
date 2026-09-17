import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useCursor, type CursorType } from './CursorContext';
import { useViewport } from '@/hooks/useViewport';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const CustomCursor: React.FC = () => {
  const { cursorType, cursorLabel } = useCursor();
  const { isDesktop, hasTouch } = useViewport();
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const visibleRef = useRef(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth, jitter-free spring interpolation
  const springConfig = { damping: 28, stiffness: 350, mass: 0.1 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable on touch devices, mobile viewports, or when user prefers reduced motion
    if (!isDesktop || hasTouch || reducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
    };

    const onMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      visibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isDesktop, hasTouch, reducedMotion, mouseX, mouseY]);

  if (!isDesktop || hasTouch || reducedMotion || !isVisible || cursorType === 'hidden') {
    return null;
  }

  // Variant geometry & visual definitions for V2 cursor system
  const stateStyles: Record<
    CursorType,
    {
      width: number;
      height: number;
      borderRadius: string;
      backgroundColor: string;
      border: string;
      label?: string;
    }
  > = {
    default: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      backgroundColor: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.25)',
    },
    interactive: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      backgroundColor: 'rgba(0, 240, 255, 0.08)',
      border: '1px solid rgba(0, 240, 255, 0.7)',
    },
    project: {
      width: 76,
      height: 32,
      borderRadius: '16px',
      backgroundColor: 'rgba(0, 240, 255, 0.95)',
      border: '1px solid #00F0FF',
      label: 'INSPECT',
    },
    explore: {
      width: 84,
      height: 32,
      borderRadius: '16px',
      backgroundColor: 'rgba(11, 11, 14, 0.9)',
      border: '1px solid #00F0FF',
      label: 'EXPLORE',
    },
    view: {
      width: 72,
      height: 30,
      borderRadius: '15px',
      backgroundColor: 'rgba(11, 11, 14, 0.9)',
      border: '1px solid rgba(0, 240, 255, 0.8)',
      label: 'VIEW',
    },
    open: {
      width: 80,
      height: 30,
      borderRadius: '15px',
      backgroundColor: 'rgba(11, 11, 14, 0.9)',
      border: '1px solid rgba(0, 240, 255, 0.8)',
      label: 'OPEN ↗',
    },
    drag: {
      width: 88,
      height: 28,
      borderRadius: '14px',
      backgroundColor: 'rgba(11, 11, 14, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      label: '← DRAG →',
    },
    rotate: {
      width: 84,
      height: 30,
      borderRadius: '15px',
      backgroundColor: 'rgba(11, 11, 14, 0.9)',
      border: '1px solid rgba(0, 240, 255, 0.8)',
      label: '↻ ROTATE',
    },
    play: {
      width: 70,
      height: 30,
      borderRadius: '15px',
      backgroundColor: 'rgba(11, 11, 14, 0.9)',
      border: '1px solid #00F0FF',
      label: '▶ PLAY',
    },
    hidden: {
      width: 0,
      height: 0,
      borderRadius: '50%',
      backgroundColor: 'transparent',
      border: 'none',
    },
  };

  const currentStyle = stateStyles[cursorType] || stateStyles.default;
  const activeLabel = cursorLabel || currentStyle.label;

  return (
    <>
      {/* Central Precision Micro-Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
            cursorType === 'interactive' || cursorType === 'explore'
              ? 'bg-accent shadow-[0_0_8px_#00F0FF]'
              : 'bg-foreground'
          }`}
        />
      </motion.div>

      {/* Outer Contextual Fluid Badge & Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          animate={{
            width: currentStyle.width,
            height: currentStyle.height,
            borderRadius: currentStyle.borderRadius,
            backgroundColor: currentStyle.backgroundColor,
            border: currentStyle.border,
          }}
          transition={{ type: 'spring', damping: 26, stiffness: 340, mass: 0.2 }}
          className="flex items-center justify-center overflow-hidden backdrop-blur-[2px] shadow-lg"
        >
          {activeLabel && (
            <span
              className={`font-mono text-[9px] uppercase tracking-widest font-semibold px-2 select-none ${
                cursorType === 'project' ? 'text-background' : 'text-accent'
              }`}
            >
              {activeLabel}
            </span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};
