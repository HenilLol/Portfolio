import React from 'react';
import { SceneCanvas } from './SceneCanvas';
import { PersistentWorldAtmosphere } from './PersistentWorldAtmosphere';

export interface PersistentWorldSceneProps {
  currentSection?: string;
  activeDimension?: string | null;
  pointerSensitivity?: number;
  className?: string;
}

export const PersistentWorldScene: React.FC<PersistentWorldSceneProps> = ({
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

export default PersistentWorldScene;
