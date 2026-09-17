import React from 'react';
import { SceneCanvas } from './SceneCanvas';
import { SpatialAtmosphere } from './SpatialAtmosphere';

export interface HeroSceneProps {
  pointerSensitivity?: number;
  className?: string;
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  pointerSensitivity = 0.35,
  className = 'w-full h-full',
}) => {
  return (
    <SceneCanvas
      cameraPosition={[0, 0, 5.5]}
      fov={45}
      interactive={false}
      className={className}
    >
      <SpatialAtmosphere pointerSensitivity={pointerSensitivity} />
    </SceneCanvas>
  );
};

export default HeroScene;
