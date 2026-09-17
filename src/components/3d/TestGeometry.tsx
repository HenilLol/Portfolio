import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

export const TestGeometry: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!reducedMotion && meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.4, 1]} />
      <meshStandardMaterial
        wireframe
        color="#00F0FF"
        emissive="#00353F"
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
};
