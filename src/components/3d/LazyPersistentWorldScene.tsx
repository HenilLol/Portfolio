import React, { lazy, Suspense } from 'react';
import { CanvasFallback } from './CanvasFallback';
import type { PersistentWorldSceneProps } from './PersistentWorldScene';

const PersistentWorldScene = lazy(() => import('./PersistentWorldScene'));

export const LazyPersistentWorldScene: React.FC<PersistentWorldSceneProps> = (props) => {
  return (
    <Suspense fallback={<CanvasFallback />}>
      <PersistentWorldScene {...props} />
    </Suspense>
  );
};
