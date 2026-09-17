import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <main className="pt-16">{children}</main>;
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="pt-16 min-h-screen"
    >
      {children}
    </motion.main>
  );
};
