import React, { Suspense, useEffect, useRef, useState } from 'react';
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

/**
 * Visibility-aware render wrapper: swaps the R3F frameloop between
 * 'always' (in view) and 'never' (parked) via IntersectionObserver.
 * A canvas scrolled far off-screen must not keep consuming GPU frames —
 * this parks the hero scene while the content sections own the viewport,
 * without unmounting it (state/scroll progress survive).
 */
const VisibilityFrameloop: React.FC<{
  children: (frameloop: 'always' | 'never') => React.ReactNode;
}> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      // Small margin avoids thrash at the exact viewport edge
      { rootMargin: '10% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="relative w-full h-full">{children(inView ? 'always' : 'never')}</div>;
};

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  className = '',
  children,
  cameraPosition = [0, 0, 5],
  fov = 45,
  interactive = true,
}) => {
  const reducedMotion = useReducedMotion();
  const { isMobile } = useViewport();

  const content = (frameloop: 'always' | 'never' | 'demand') => (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          camera={{ position: cameraPosition, fov }}
          dpr={[1, isMobile ? 1.25 : 1.75]} // Cap DPR for high performance
          frameloop={reducedMotion ? 'demand' : frameloop} // Park when off-screen; static profile on reduced motion
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

  if (reducedMotion) {
    // Static profile — no visibility machinery needed
    return content('demand');
  }

  return (
    <VisibilityFrameloop>
      {(frameloop) => content(frameloop)}
    </VisibilityFrameloop>
  );
};
