import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASING, DURATION } from '@/animations/presets/motionTokens';

export interface FadeProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const Fade: React.FC<FadeProps> = ({
  children,
  delay = 0,
  duration = DURATION.FAST,
  className,
  ...props
}) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration,
        ease: EASING.editorial,
        delay,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
