import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useCursor } from './CursorContext';
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

  // Variant geometry & visual definitions
  const stateStyles = {
    default: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: '#F4F4F6',
      border: 'none',
    },
    interactive: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      backgroundColor: 'rgba(0, 240, 255, 0.08)',
      border: '1px solid rgba(0, 240, 255, 0.6)',
    },
    project: {
      width: 72,
      height: 72,
      borderRadius: '50%',
      backgroundColor: '#00F0FF',
      border: 'none',
    },
    drag: {
      width: 54,
      height: 28,
      borderRadius: '14px',
      backgroundColor: 'rgba(20, 20, 25, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
    },
  };

  const currentStyle = stateStyles[cursorType] || stateStyles.default;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
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
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="flex items-center justify-center overflow-hidden"
      >
        {cursorType === 'project' && (
          <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-background select-none">
            {cursorLabel || 'VIEW'}
          </span>
        )}
        {cursorType === 'drag' && (
          <span className="font-mono text-[8px] uppercase tracking-widest text-foreground select-none flex items-center gap-1">
            <span>←</span>
            <span>DRAG</span>
            <span>→</span>
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};
