import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Lighting } from './Lighting';
import { CanvasFallback } from './CanvasFallback';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useViewport } from '@/hooks/useViewport';

interface SceneCanvasProps {
  className?: string;
  children?: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  interactive?: boolean;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  className = '',
  children,
  cameraPosition = [0, 0, 5],
  fov = 45,
  interactive = true,
}) => {
  const reducedMotion = useReducedMotion();
  const { isMobile } = useViewport();

  return (
    <div className={`relative w-full h-full min-h-[300px] overflow-hidden ${className}`}>
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          camera={{ position: cameraPosition, fov }}
          dpr={[1, isMobile ? 1.25 : 1.75]} // Cap DPR for high performance
          frameloop={reducedMotion ? 'demand' : 'always'} // Conserve GPU on reduced motion
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ pointerEvents: interactive ? 'auto' : 'none' }}
        >
          <Lighting />
          {children}
        </Canvas>
      </Suspense>
    </div>
  );
};
