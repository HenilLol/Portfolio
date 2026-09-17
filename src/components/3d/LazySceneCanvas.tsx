import React, { lazy, Suspense } from 'react';
import { CanvasFallback } from './CanvasFallback';

// Dynamically import SceneCanvas to isolate WebGL instantiation
const SceneCanvas = lazy(() =>
  import('./SceneCanvas').then((mod) => ({ default: mod.SceneCanvas }))
);

export interface LazySceneCanvasProps {
  className?: string;
  children?: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  interactive?: boolean;
}

export const LazySceneCanvas: React.FC<LazySceneCanvasProps> = (props) => {
  return (
    <Suspense fallback={<CanvasFallback />}>
      <SceneCanvas {...props} />
    </Suspense>
  );
};
