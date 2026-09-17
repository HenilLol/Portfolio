import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASING, DURATION } from '@/animations/presets/motionTokens';

export interface RevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'clip';
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className,
  ...props
}) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    up: {
      initial: { opacity: 0, y: 32 },
      animate: { opacity: 1, y: 0 },
    },
    down: {
      initial: { opacity: 0, y: -32 },
      animate: { opacity: 1, y: 0 },
    },
    clip: {
      initial: { clipPath: 'inset(100% 0% 0% 0%)' },
      animate: { clipPath: 'inset(0% 0% 0% 0%)' },
    },
  };

  const selected = variants[direction];

  return (
    <motion.div
      initial={selected.initial}
      animate={selected.animate}
      transition={{
        duration: DURATION.MEDIUM,
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
