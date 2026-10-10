import React, { lazy, Suspense, memo } from 'react';
import { CanvasFallback } from './CanvasFallback';
import type { PersistentWorldSceneProps } from './PersistentWorldScene';

const PersistentWorldScene = lazy(() => import('./PersistentWorldScene'));

/**
 * Memoized lazy boundary for the persistent world scene — shields the WebGL
 * canvas from high-frequency re-renders in its parent (scroll velocity state
 * updates fire at 60Hz during scrolling).
 */
export const LazyPersistentWorldScene: React.FC<PersistentWorldSceneProps> = memo((props) => {
  return (
    <Suspense fallback={<CanvasFallback />}>
      <PersistentWorldScene {...props} />
    </Suspense>
  );
});
