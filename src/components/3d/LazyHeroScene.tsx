import React, { lazy, Suspense } from 'react';
import { CanvasFallback } from './CanvasFallback';

// Truly dynamic lazy import: cuts all static dependencies on 'three' from the entry bundle
const HeroScene = lazy(() => import('./HeroScene'));

export interface LazyHeroSceneProps {
  pointerSensitivity?: number;
  className?: string;
}

export const LazyHeroScene: React.FC<LazyHeroSceneProps> = (props) => {
  return (
    <Suspense fallback={<CanvasFallback />}>
      <HeroScene {...props} />
    </Suspense>
  );
};
