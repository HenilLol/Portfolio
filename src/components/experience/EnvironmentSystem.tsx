import React, { useEffect, useRef } from 'react';
import { useScrollVelocity } from '@/hooks/useScrollVelocity';
import { useViewport } from '@/hooks/useViewport';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { LazyPersistentWorldScene } from '@/components/3d/LazyPersistentWorldScene';
import { useEnvironment } from './EnvironmentContext';

interface EnvironmentSystemProps {
  currentSection?: string;
}

export const EnvironmentSystem: React.FC<EnvironmentSystemProps> = ({
  currentSection: propSection = 'hero',
}) => {
  const envContext = useEnvironment();
  const effectiveSection = envContext.currentSection || propSection || 'hero';
  const activeDimension = envContext.activeDimension;

  const { normalizedVelocity, isScrolling } = useScrollVelocity();
  const { isDesktop, hasTouch } = useViewport();
  const reducedMotion = useReducedMotion();
  const lightRef = useRef<HTMLDivElement>(null);
  const gridLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDesktop || hasTouch || reducedMotion) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let animFrameId: number;

    const onPointerMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });

    const renderLoop = () => {
      // Smooth lerp following cursor
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${currentX - 400}px, ${currentY - 400}px, 0)`;
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      cancelAnimationFrame(animFrameId);
    };
  }, [isDesktop, hasTouch, reducedMotion]);

  // Contextual atmospheric energy parameters
  const isHeneoxy = effectiveSection === 'heneoxy' || effectiveSection === 'project-world-heneoxy';
  const isProject = effectiveSection.includes('project') || effectiveSection === 'projects';
  const isCreative = effectiveSection === 'creative';
  const isEnding = effectiveSection === 'contact' || effectiveSection === 'ending';

  // Light field color & opacity per context
  let lightColor = 'rgba(0, 240, 255, 0.03)';
  let ambientScale = 1;

  if (isHeneoxy) {
    lightColor = 'rgba(0, 240, 255, 0.06)';
    ambientScale = 1.25;
  } else if (isCreative) {
    lightColor = 'rgba(168, 85, 247, 0.035)';
    ambientScale = 1.1;
  } else if (isProject) {
    lightColor = 'rgba(59, 130, 246, 0.035)';
  } else if (isEnding) {
    lightColor = 'rgba(255, 255, 255, 0.015)';
    ambientScale = 0.8;
  }

  // Velocity stretch / reactive intensity
  const dynamicVelocityOpacity = isScrolling ? Math.min(0.04 + normalizedVelocity * 0.05, 0.09) : 0.03;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-1000"
    >
      {/* 1. Persistent 3D Celestial Atmosphere & Coordinate Environment */}
      <div className="absolute inset-0 z-0">
        <LazyPersistentWorldScene
          currentSection={effectiveSection}
          activeDimension={activeDimension}
          pointerSensitivity={0.35}
        />
      </div>

      {/* 2. Dynamic Cursor Light Field */}
      {isDesktop && !hasTouch && !reducedMotion && (
        <div
          ref={lightRef}
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-[100px] will-change-transform transition-opacity duration-700 z-[1]"
          style={{
            background: `radial-gradient(circle, ${lightColor} 0%, rgba(7, 7, 9, 0) 70%)`,
            transform: 'translate3d(-400px, -400px, 0)',
            opacity: dynamicVelocityOpacity * ambientScale * 25,
          }}
        />
      )}

      {/* 3. Precision Geometric Horizon Grid */}
      <div
        ref={gridLayerRef}
        className="absolute inset-0 opacity-[0.035] transition-opacity duration-1000 z-[2]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: isProject ? '48px 48px' : '72px 72px',
        }}
      />

      {/* 4. Subtle Vignette Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,7,9,0.85)_100%)] pointer-events-none z-[3]" />
    </div>
  );
};
