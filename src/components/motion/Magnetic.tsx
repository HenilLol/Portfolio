import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useViewport } from '@/hooks/useViewport';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SPRINGS } from '@/animations/presets/motionTokens';

export interface MagneticProps {
  children: React.ReactNode;
  strength?: number; // 0.1 to 0.5 (restrained)
  radius?: number; // pixel activation radius
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.32,
  radius = 90,
  className = '',
}) => {
  const { isDesktop, hasTouch } = useViewport();
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isEnabled = isDesktop && !hasTouch && !reducedMotion;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEnabled || !ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance < radius) {
      setPosition({
        x: deltaX * strength,
        y: deltaY * strength,
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  if (!isEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={SPRINGS.magnetic}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};
