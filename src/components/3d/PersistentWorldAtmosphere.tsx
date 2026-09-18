import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useViewport } from '@/hooks/useViewport';

export interface PersistentWorldAtmosphereProps {
  currentSection?: string;
  activeDimension?: string | null;
  pointerSensitivity?: number;
}

// 6 Dimensions coordinates in 3D around the celestial / architectural core
const DIMENSION_NODES = [
  { id: 'software', label: 'SOFTWARE', pos: [2.6, 1.4, -0.4] as [number, number, number], color: '#00F0FF' },
  { id: 'ai-agents', label: 'AI & AGENTS', pos: [-2.4, 1.6, 0.6] as [number, number, number], color: '#38BDF8' },
  { id: 'systems', label: 'SYSTEMS', pos: [2.8, -1.2, 0.5] as [number, number, number], color: '#818CF8' },
  { id: 'webgl-3d', label: 'WEBGL & 3D', pos: [-2.0, -1.8, -0.6] as [number, number, number], color: '#A855F7' },
  { id: 'creative-tech', label: 'CREATIVE', pos: [0.2, 2.7, 0.8] as [number, number, number], color: '#EC4899' },
  { id: 'exploration', label: 'EXPLORATION', pos: [-0.3, -2.6, -0.7] as [number, number, number], color: '#F59E0B' },
];

export const PersistentWorldAtmosphere: React.FC<PersistentWorldAtmosphereProps> = ({
  currentSection = 'hero',
  activeDimension = null,
  pointerSensitivity = 0.35,
}) => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const planetGroupRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const satelliteRef = useRef<THREE.Mesh>(null);

  const constellationGroupRef = useRef<THREE.Group>(null);
  const projectTopologyGroupRef = useRef<THREE.Group>(null);
  const starPointsRef = useRef<THREE.Points>(null);

  const reducedMotion = useReducedMotion();
  const { isMobile, hasTouch } = useViewport();
  const { pointer } = useThree();

  // 1. Procedural Starfield (650 stars desktop / 240 mobile)
  const starCount = useMemo(() => (isMobile ? 240 : 650), [isMobile]);
  const [starPositions, starColors] = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const colorWhite = new THREE.Color('#FFFFFF');
    const colorCyan = new THREE.Color('#00F0FF');
    const colorDim = new THREE.Color('#8F9098');

    for (let i = 0; i < starCount; i++) {
      const radius = 3.5 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const dice = Math.random();
      const chosenColor = dice > 0.85 ? colorCyan : dice > 0.4 ? colorWhite : colorDim;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }
    return [positions, colors];
  }, [starCount]);

  // 2. Constellation line buffer connecting central anchor (0,0,0) to dimension nodes
  const constellationLinePositions = useMemo(() => {
    const coords: number[] = [];
    DIMENSION_NODES.forEach((node) => {
      coords.push(0, 0, 0);
      coords.push(node.pos[0], node.pos[1], node.pos[2]);
    });
    return new Float32Array(coords);
  }, []);

  // 3. Section targets: Continuous environmental narrative progression
  // As specified in Master Spec Section 5 & 23:
  // The celestial planet belongs primarily to the identity scene.
  // As user moves down, the planet dissolves, constellation activates,
  // then project topology forms, and finally it resolves into shutdown.
  const targetState = useMemo(() => {
    const sec = currentSection?.toLowerCase() || 'hero';

    if (sec === 'hero') {
      return {
        pos: [isMobile ? 0 : 1.4, isMobile ? -0.2 : 0, 0] as [number, number, number],
        rot: [0.2, 0.4, 0] as [number, number, number],
        scale: isMobile ? 0.85 : 1.05,
        planetOpacity: 1.0,
        ringsOpacity: 0.35,
        constellationOpacity: 0.0,
        projectTopologyOpacity: 0.0,
        starfieldOpacity: 0.8,
      };
    }

    if (sec === 'about') {
      return {
        pos: [isMobile ? 0 : -1.6, 0.1, -0.6] as [number, number, number],
        rot: [0.35, 1.2, -0.2] as [number, number, number],
        scale: isMobile ? 0.85 : 1.15,
        planetOpacity: 0.08, // Planet dissolves into the background
        ringsOpacity: 0.06,
        constellationOpacity: 0.95, // Constellation blooms forward
        projectTopologyOpacity: 0.0,
        starfieldOpacity: 0.65,
      };
    }

    if (sec === 'skills') {
      return {
        pos: [0, 0, -1.2] as [number, number, number],
        rot: [Math.PI / 2.2, 0.2, 0.4] as [number, number, number],
        scale: 1.0,
        planetOpacity: 0.0,
        ringsOpacity: 0.0,
        constellationOpacity: 0.8, // Wide technical constellation
        projectTopologyOpacity: 0.15,
        starfieldOpacity: 0.55,
      };
    }

    if (sec.includes('project')) {
      return {
        pos: [isMobile ? 0 : 1.5, -0.2, -0.3] as [number, number, number],
        rot: [0.5, 2.5, 0.3] as [number, number, number],
        scale: isMobile ? 0.85 : 1.1,
        planetOpacity: 0.0,
        ringsOpacity: 0.0,
        constellationOpacity: 0.0,
        projectTopologyOpacity: 0.85, // Dedicated project altitude / strata topology
        starfieldOpacity: 0.5,
      };
    }

    if (sec === 'creative') {
      return {
        pos: [0, 0.3, -0.9] as [number, number, number],
        rot: [0.1, 3.2, -0.3] as [number, number, number],
        scale: 0.95,
        planetOpacity: 0.0,
        ringsOpacity: 0.0,
        constellationOpacity: 0.1,
        projectTopologyOpacity: 0.05,
        starfieldOpacity: 0.9, // Deep field cinematic dust
      };
    }

    if (sec === 'experience' || sec === 'journey') {
      return {
        pos: [0, 0, -0.8] as [number, number, number],
        rot: [0.2, 1.8, 0.1] as [number, number, number],
        scale: 0.9,
        planetOpacity: 0.0,
        ringsOpacity: 0.04,
        constellationOpacity: 0.4,
        projectTopologyOpacity: 0.2,
        starfieldOpacity: 0.6,
      };
    }

    if (sec === 'ending' || sec === 'contact') {
      return {
        pos: [0, 0, -0.6] as [number, number, number],
        rot: [0.1, 4.5, 0] as [number, number, number],
        scale: 0.35,
        planetOpacity: 0.0,
        ringsOpacity: 0.0,
        constellationOpacity: 0.0,
        projectTopologyOpacity: 0.0,
        starfieldOpacity: 0.2, // Atmosphere powers down
      };
    }

    // Default fallback
    return {
      pos: [1.2, 0, 0] as [number, number, number],
      rot: [0.2, 0.4, 0] as [number, number, number],
      scale: 1.0,
      planetOpacity: 0.5,
      ringsOpacity: 0.15,
      constellationOpacity: 0.2,
      projectTopologyOpacity: 0.1,
      starfieldOpacity: 0.7,
    };
  }, [currentSection, isMobile]);

  // Frame tick: smooth continuous kinematics and deterministic lerping
  useFrame((state, delta) => {
    if (!masterGroupRef.current) return;

    const group = masterGroupRef.current;
    const lerpSpeed = Math.min(delta * 2.8, 0.12);

    // 1. Lerp master group position and scale
    group.position.x = THREE.MathUtils.lerp(group.position.x, targetState.pos[0], lerpSpeed);
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetState.pos[1], lerpSpeed);
    group.position.z = THREE.MathUtils.lerp(group.position.z, targetState.pos[2], lerpSpeed);

    const currentScale = group.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetState.scale, lerpSpeed);
    group.scale.set(nextScale, nextScale, nextScale);

    // 2. Dynamically interpolate planet & rings opacity
    if (planetMeshRef.current) {
      const mat = planetMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetState.planetOpacity, lerpSpeed);
      mat.transparent = true;
    }
    if (atmosphereRef.current) {
      const mat = atmosphereRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetState.planetOpacity * 0.08, lerpSpeed);
    }
    if (ring1Ref.current) {
      const mat = ring1Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetState.ringsOpacity, lerpSpeed);
    }
    if (ring2Ref.current) {
      const mat = ring2Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetState.ringsOpacity * 0.5, lerpSpeed);
    }
    if (ring3Ref.current) {
      const mat = ring3Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetState.ringsOpacity * 0.4, lerpSpeed);
    }
    if (satelliteRef.current) {
      const mat = satelliteRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetState.planetOpacity, lerpSpeed);
      mat.transparent = true;
    }
    if (starPointsRef.current) {
      const mat = starPointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetState.starfieldOpacity, lerpSpeed);
    }

    if (!reducedMotion) {
      const time = state.clock.getElapsedTime();

      // Continuous celestial rotations
      if (planetMeshRef.current) {
        planetMeshRef.current.rotation.y += delta * 0.05;
      }
      if (atmosphereRef.current) {
        atmosphereRef.current.rotation.y += delta * 0.03;
      }

      // Orbital Rings Rotation
      if (ring1Ref.current) {
        ring1Ref.current.rotation.z += delta * 0.04;
      }
      if (ring2Ref.current) {
        ring2Ref.current.rotation.y -= delta * 0.035;
      }
      if (ring3Ref.current) {
        ring3Ref.current.rotation.z -= delta * 0.05;
      }

      // Satellite orbit
      if (satelliteRef.current) {
        const satAngle = time * 0.6;
        const satRadius = 2.45;
        satelliteRef.current.position.set(
          Math.cos(satAngle) * satRadius,
          Math.sin(satAngle) * Math.sin(Math.PI / 3) * satRadius,
          Math.sin(satAngle) * Math.cos(Math.PI / 3) * satRadius
        );
      }

      // Pointer parallax response (disabled on touch / mobile)
      const disableParallax = isMobile || hasTouch;
      const targetParallaxX = disableParallax ? 0 : -pointer.y * pointerSensitivity * 0.4;
      const targetParallaxY = disableParallax ? 0 : pointer.x * pointerSensitivity * 0.5;

      group.rotation.x = THREE.MathUtils.lerp(
        group.rotation.x,
        targetState.rot[0] + targetParallaxX,
        lerpSpeed
      );
      group.rotation.y = THREE.MathUtils.lerp(
        group.rotation.y,
        targetState.rot[1] + targetParallaxY + time * 0.015,
        lerpSpeed
      );
      group.rotation.z = THREE.MathUtils.lerp(
        group.rotation.z,
        targetState.rot[2],
        lerpSpeed
      );
    }
  });

  return (
    <group ref={masterGroupRef} position={targetState.pos}>
      {/* =======================================================
          1. CELESTIAL PLANET CORE & ATMOSPHERE (HERO NARRATIVE)
      ======================================================= */}
      <group ref={planetGroupRef}>
        {/* Dark Obsidian Planet Body */}
        <mesh ref={planetMeshRef}>
          <sphereGeometry args={[1.35, 48, 48]} />
          <meshStandardMaterial
            color="#0A0D14"
            roughness={0.7}
            metalness={0.3}
            wireframe={false}
            transparent={true}
            opacity={targetState.planetOpacity}
          />
        </mesh>

        {/* Luminous Outer Atmosphere Envelope */}
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[1.39, 32, 32]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={targetState.planetOpacity * 0.08}
            wireframe={true}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Primary Tilted Orbital Ring */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[2.45, 0.012, 16, 120]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={targetState.ringsOpacity}
          />
        </mesh>

        {/* Secondary Coordinate Ring */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
          <torusGeometry args={[3.2, 0.008, 16, 120]} />
          <meshBasicMaterial
            color="#E4E4E7"
            transparent
            opacity={targetState.ringsOpacity * 0.5}
          />
        </mesh>

        {/* Tertiary Inner Ring */}
        <mesh ref={ring3Ref} rotation={[Math.PI / 6, -Math.PI / 4, Math.PI / 8]}>
          <torusGeometry args={[1.85, 0.006, 16, 96]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={targetState.ringsOpacity * 0.4}
          />
        </mesh>

        {/* Orbiting Satellite Beacon */}
        <mesh ref={satelliteRef}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent={true}
            opacity={targetState.planetOpacity}
          />
        </mesh>
      </group>

      {/* =======================================================
          2. SPATIAL DIMENSION CONSTELLATION (ABOUT / SKILLS NARRATIVE)
      ======================================================= */}
      <group ref={constellationGroupRef}>
        {/* Radiating Links from Core to Dimension Nodes */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[constellationLinePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#00F0FF"
            transparent
            opacity={targetState.constellationOpacity * 0.4}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>

        {/* 6 Dimension System Spatial Nodes */}
        {DIMENSION_NODES.map((node) => {
          const isNodeActive = activeDimension === node.id;
          return (
            <group key={node.id} position={node.pos}>
              {/* Core Node Beacon */}
              <mesh>
                <sphereGeometry args={[isNodeActive ? 0.09 : 0.055, 16, 16]} />
                <meshBasicMaterial
                  color={isNodeActive ? '#00F0FF' : node.color}
                  transparent
                  opacity={isNodeActive ? 1.0 : targetState.constellationOpacity}
                />
              </mesh>

              {/* Node Pulse Halo */}
              <mesh>
                <ringGeometry args={[0.08, 0.12, 24]} />
                <meshBasicMaterial
                  color={node.color}
                  transparent
                  opacity={isNodeActive ? 0.7 : targetState.constellationOpacity * 0.3}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* =======================================================
          3. PROJECT WORLD TOPOLOGY (PROJECTS NARRATIVE)
      ======================================================= */}
      <group ref={projectTopologyGroupRef}>
        {/* Concentric Altitude Radar Arcs (AeroIndex) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.02, 64]} />
          <meshBasicMaterial
            color="#3B82F6"
            transparent
            opacity={targetState.projectTopologyOpacity * 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.7, 2.715, 64]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={targetState.projectTopologyOpacity * 0.25}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Geological Strata Horizontal Planes (COALINTEL) */}
        <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.415, 48]} />
          <meshBasicMaterial
            color="#F59E0B"
            transparent
            opacity={targetState.projectTopologyOpacity * 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Architectural Perspective Plane Grid (Blueprint) */}
        <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 4]}>
          <ringGeometry args={[1.8, 1.815, 4]} />
          <meshBasicMaterial
            color="#E4E4E7"
            transparent
            opacity={targetState.projectTopologyOpacity * 0.18}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* =======================================================
          4. PERSISTENT STARFIELD (DYNAMIC INTENSITY PER SECTION)
      ======================================================= */}
      <points ref={starPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[starColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.02 : 0.028}
          vertexColors
          transparent
          opacity={targetState.starfieldOpacity}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
