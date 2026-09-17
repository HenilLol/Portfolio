import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fadeUp, fadeIn } from '@/animations/presets/motionPresets';

interface MotionFadeProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'none';
}

export const MotionFade: React.FC<MotionFadeProps> = ({
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

  const preset = direction === 'up' ? fadeUp : fadeIn;

  return (
    <motion.div
      initial={preset.initial}
      animate={preset.animate}
      exit={preset.exit}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
