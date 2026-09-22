import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASING } from '@/animations/presets/motionTokens';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  withTopPadding?: boolean;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  withTopPadding = true,
}) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <main id="main-content" tabIndex={-1} className={`${withTopPadding ? 'pt-16 ' : ''}min-h-screen focus:outline-none ${className}`}>
        {children}
      </main>
    );
  }

  // Cinematic editorial transition variants
  const containerVariants = {
    initial: {
      opacity: 0,
      y: 16,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: EASING.editorial,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -16,
      transition: {
        duration: 0.3,
        ease: EASING.editorial,
      },
    },
  };

  // Editorial curtain overlay that sweeps on route changes
  const curtainVariants = {
    initial: {
      clipPath: 'inset(0% 0% 0% 0%)',
    },
    animate: {
      clipPath: 'inset(0% 0% 100% 0%)',
      transition: {
        duration: 0.5,
        ease: EASING.editorial,
      },
    },
    exit: {
      clipPath: 'inset(100% 0% 0% 0%)',
      transition: {
        duration: 0.35,
        ease: EASING.editorial,
      },
    },
  };

  return (
    <div className="relative w-full">
      {/* Editorial Architectural Reveal Curtain */}
      <motion.div
        aria-hidden="true"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={curtainVariants}
        className="fixed inset-0 z-30 pointer-events-none bg-background-surface/90 backdrop-blur-sm flex flex-col justify-end p-8 border-b border-accent/40"
      >
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-accent/80 pb-2">
          <span>ROUTING // CALIBRATING SYSTEM</span>
          <span>● TRANSITION</span>
        </div>
      </motion.div>

      {/* Main Page Content */}
      <motion.main
        id="main-content"
        tabIndex={-1}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={containerVariants}
        className={`${withTopPadding ? 'pt-16 ' : ''}min-h-screen focus:outline-none ${className}`}
      >
        {children}
      </motion.main>
    </div>
  );
};
