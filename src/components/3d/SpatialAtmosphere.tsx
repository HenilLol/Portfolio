import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useViewport } from '@/hooks/useViewport';

export interface SpatialAtmosphereProps {
  pointerSensitivity?: number;
}

const AXIS_CROSSHAIR_VERTICES = new Float32Array([
  -1.2, 0, 0, 1.2, 0, 0,
  0, -1.2, 0, 0, 1.2, 0,
  0, 0, -1.2, 0, 0, 1.2,
]);

export const SpatialAtmosphere: React.FC<SpatialAtmosphereProps> = ({
  pointerSensitivity = 0.4,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const reducedMotion = useReducedMotion();
  const { isMobile, hasTouch } = useViewport();
  const { pointer } = useThree();

  // Constrained particle count: 80 on mobile, 220 on desktop for strict 60 FPS
  const particleCount = useMemo(() => (isMobile ? 80 : 220), [isMobile]);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      // Subtle continuous celestial drift
      groupRef.current.rotation.y += delta * 0.04;

      if (ring1Ref.current) {
        ring1Ref.current.rotation.x += delta * 0.06;
        ring1Ref.current.rotation.y -= delta * 0.03;
      }

      if (ring2Ref.current) {
        ring2Ref.current.rotation.z += delta * 0.05;
        ring2Ref.current.rotation.x -= delta * 0.04;
      }

      // Smooth pointer parallax response via Three.js pointer coordinates (disabled on touch/mobile)
      const disableParallax = isMobile || hasTouch;
      const targetRotationX = disableParallax ? 0 : -pointer.y * pointerSensitivity * 0.3;
      const targetRotationY = disableParallax ? 0 : pointer.x * pointerSensitivity * 0.4;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        delta * 2.5
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        groupRef.current.rotation.y + targetRotationY * 0.05,
        delta * 2.5
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Subtle Spatial Coordinate Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.2, 0.008, 16, 100]} />
        <meshBasicMaterial
          color="#F4F4F6"
          transparent
          opacity={0.12}
          wireframe={false}
        />
      </mesh>

      {/* Subtle Spatial Coordinate Ring 2 - Tilted with Cyan Accent */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.8, 0.006, 16, 100]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.15}
          wireframe={false}
        />
      </mesh>

      {/* Inner Technical Axis Crosshair */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[AXIS_CROSSHAIR_VERTICES, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#8F9098"
          transparent
          opacity={0.08}
        />
      </lineSegments>

      {/* Restrained Spatial Node Field */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.025 : 0.035}
          color="#00F0FF"
          transparent
          opacity={0.35}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
