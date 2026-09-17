import React from 'react';

/**
 * Procedural grain layer: zero runtime JavaScript, pointer-events none,
 * lightweight SVG filter with ultra-low visual intensity (0.025 opacity).
 */
export const GrainLayer: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-30 select-none bg-grain"
    />
  );
};
