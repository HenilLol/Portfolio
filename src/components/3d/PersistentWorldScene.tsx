import React from 'react';
import { SceneCanvas } from './SceneCanvas';
import { PersistentWorldAtmosphere } from './PersistentWorldAtmosphere';

export interface PersistentWorldSceneProps {
  currentSection?: string;
  activeDimension?: string | null;
  pointerSensitivity?: number;
  className?: string;
}

/**
 * The persistent background scene is expensive to reconcile (a full R3F canvas
 * with a 25k-char atmosphere system). It only depends on discrete inputs
 * (section id, dimension id) — memoize so high-frequency parent re-renders
 * (scroll velocity updates at 60Hz) never cascade into the WebGL tree.
 */
const PersistentWorldSceneInner: React.FC<PersistentWorldSceneProps> = ({
  currentSection = 'hero',
  activeDimension = null,
  pointerSensitivity = 0.35,
  className = 'w-full h-full',
}) => {
  return (
    <SceneCanvas
      cameraPosition={[0, 0, 5.8]}
      fov={45}
      interactive={false}
      className={className}
    >
      <PersistentWorldAtmosphere
        currentSection={currentSection}
        activeDimension={activeDimension}
        pointerSensitivity={pointerSensitivity}
      />
    </SceneCanvas>
  );
};

export const PersistentWorldScene = React.memo(PersistentWorldSceneInner);

export default PersistentWorldScene;
