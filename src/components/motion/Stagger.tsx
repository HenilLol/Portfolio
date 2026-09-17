import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface StaggerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  staggerMs?: number;
  delayMs?: number;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  staggerMs = 0.08,
  delayMs = 0,
  className,
  ...props
}) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerMs,
            delayChildren: delayMs,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
