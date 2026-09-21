import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useViewport } from '@/hooks/useViewport';
import { useEnvironment } from '@/components/experience/EnvironmentContext';

export interface PersistentWorldAtmosphereProps {
  currentSection?: string;
  activeDimension?: string | null;
  pointerSensitivity?: number;
}

// 4 Cardinal Dimensions coordinates in 3D around central HENIL anchor
const CARDINAL_NODES = [
  { id: 'engineering', label: 'ENGINEERING', pos: [0, 2.2, 0.2] as [number, number, number], color: '#00F0FF' },
  { id: 'ai', label: 'AI', pos: [2.5, 0.1, -0.3] as [number, number, number], color: '#38BDF8' },
  { id: 'systems', label: 'SYSTEMS', pos: [0, -2.2, 0.2] as [number, number, number], color: '#818CF8' },
  { id: 'creative', label: 'CREATIVE', pos: [-2.5, 0.1, -0.3] as [number, number, number], color: '#EC4899' },
];

export const PersistentWorldAtmosphere: React.FC<PersistentWorldAtmosphereProps> = ({
  activeDimension = null,
  pointerSensitivity = 0.35,
}) => {
  const { worldProgress } = useEnvironment();
  const masterGroupRef = useRef<THREE.Group>(null);
  const planetGroupRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const satelliteRef = useRef<THREE.Mesh>(null);

  const constellationGroupRef = useRef<THREE.Group>(null);
  const techNetworkGroupRef = useRef<THREE.Group>(null);
  const projectTopologyGroupRef = useRef<THREE.Group>(null);
  const creativePlanesGroupRef = useRef<THREE.Group>(null);
  const starPointsRef = useRef<THREE.Points>(null);

  const reducedMotion = useReducedMotion();
  const { isMobile, hasTouch } = useViewport();
  const { camera, pointer } = useThree();

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

  // 2. Constellation line buffer connecting central anchor (0,0,0) to cardinal nodes
  const constellationLinePositions = useMemo(() => {
    const coords: number[] = [];
    CARDINAL_NODES.forEach((node) => {
      coords.push(0, 0, 0);
      coords.push(node.pos[0], node.pos[1], node.pos[2]);
    });
    // Cross connections between adjacent cardinal nodes
    coords.push(CARDINAL_NODES[0].pos[0], CARDINAL_NODES[0].pos[1], CARDINAL_NODES[0].pos[2]);
    coords.push(CARDINAL_NODES[1].pos[0], CARDINAL_NODES[1].pos[1], CARDINAL_NODES[1].pos[2]);

    coords.push(CARDINAL_NODES[1].pos[0], CARDINAL_NODES[1].pos[1], CARDINAL_NODES[1].pos[2]);
    coords.push(CARDINAL_NODES[2].pos[0], CARDINAL_NODES[2].pos[1], CARDINAL_NODES[2].pos[2]);

    coords.push(CARDINAL_NODES[2].pos[0], CARDINAL_NODES[2].pos[1], CARDINAL_NODES[2].pos[2]);
    coords.push(CARDINAL_NODES[3].pos[0], CARDINAL_NODES[3].pos[1], CARDINAL_NODES[3].pos[2]);

    coords.push(CARDINAL_NODES[3].pos[0], CARDINAL_NODES[3].pos[1], CARDINAL_NODES[3].pos[2]);
    coords.push(CARDINAL_NODES[0].pos[0], CARDINAL_NODES[0].pos[1], CARDINAL_NODES[0].pos[2]);

    return new Float32Array(coords);
  }, []);

  // 3. Continuous Camera & World Choreography driven by worldProgress (0 to 1)
  const targetWorld = useMemo(() => {
    const p = worldProgress;

    // Stage 0.00 – 0.08: DORMANT
    if (p < 0.04) {
      return {
        camPos: [0, 0, 6.8] as [number, number, number],
        camLookAt: [0, 0, 0] as [number, number, number],
        groupPos: [isMobile ? 0 : 1.3, isMobile ? -0.2 : 0, 0] as [number, number, number],
        groupRot: [0.2, 0.4, 0] as [number, number, number],
        groupScale: isMobile ? 0.85 : 1.05,
        planetOpacity: 0.0,
        ringsOpacity: 0.0,
        constellationOpacity: 0.0,
        techNetworkOpacity: 0.0,
        projectTopologyOpacity: 0.0,
        creativePlanesOpacity: 0.0,
        starfieldOpacity: 0.35,
      };
    }

    // Stage 0.04 – 0.14: IDENTITY BREAK (Letters fragment into field)
    if (p < 0.14) {
      const stageP = (p - 0.04) / 0.10;
      return {
        camPos: [0.4 * (1 - stageP), 0.2 * stageP, 6.8 - stageP * 1.8] as [number, number, number],
        camLookAt: [0, 0, 0] as [number, number, number],
        groupPos: [1.3 * (1 - stageP), 0.2 * stageP, -0.4 * stageP] as [number, number, number],
        groupRot: [0.2 + stageP * 0.4, 0.4 + stageP * 1.2, stageP * 0.2] as [number, number, number],
        groupScale: 1.05 + stageP * 0.15,
        planetOpacity: 0.0,
        ringsOpacity: 0.0,
        constellationOpacity: stageP * 0.6,
        techNetworkOpacity: 0.0,
        projectTopologyOpacity: 0.0,
        creativePlanesOpacity: 0.0,
        starfieldOpacity: 0.45,
      };
    }

    // Stage 0.14 – 0.28: CONSTELLATION / ABOUT SPATIAL COORDINATE SPACE
    if (p < 0.28) {
      const stageP = (p - 0.14) / 0.14;
      return {
        camPos: [-1.4 * stageP, 0.2, 5.0 - stageP * 0.6] as [number, number, number],
        camLookAt: [0, 0, 0] as [number, number, number],
        groupPos: [isMobile ? 0 : -1.6, 0.1, -0.6] as [number, number, number],
        groupRot: [0.35, 1.2 + stageP * 0.4, -0.2] as [number, number, number],
        groupScale: isMobile ? 0.85 : 1.15,
        planetOpacity: 0.05,
        ringsOpacity: 0.04,
        constellationOpacity: 0.95, // 4-dimension cardinal constellation blooms
        techNetworkOpacity: stageP * 0.3,
        projectTopologyOpacity: 0.0,
        creativePlanesOpacity: 0.0,
        starfieldOpacity: 0.65,
      };
    }

    // Stage 0.28 – 0.42: LIVING TECHNOLOGY NETWORK
    if (p < 0.42) {
      const stageP = (p - 0.28) / 0.14;
      return {
        camPos: [0, 0.3 * stageP, 4.4 + stageP * 0.8] as [number, number, number],
        camLookAt: [0, 0, 0] as [number, number, number],
        groupPos: [0, 0, -1.0] as [number, number, number],
        groupRot: [Math.PI / 2.2, 0.2 + stageP * 0.4, 0.4] as [number, number, number],
        groupScale: 1.0,
        planetOpacity: 0.0,
        ringsOpacity: 0.0,
        constellationOpacity: 0.6 * (1 - stageP),
        techNetworkOpacity: 0.9, // Living relational graph expands
        projectTopologyOpacity: stageP * 0.2,
        creativePlanesOpacity: 0.0,
        starfieldOpacity: 0.55,
      };
    }

    // Stage 0.42 – 0.64: HENEOXY ENTRY & SYSTEM OPERATING ENVIRONMENT
    if (p < 0.64) {
      const stageP = (p - 0.42) / 0.22;
      return {
        camPos: [0.6 * (1 - stageP), -0.2 * stageP, 5.2 - stageP * 1.6] as [number, number, number],
        camLookAt: [0, 0, 0] as [number, number, number],
        groupPos: [isMobile ? 0 : 1.4, -0.2, -0.2] as [number, number, number],
        groupRot: [0.4, 2.2 + stageP * 0.6, 0.2] as [number, number, number],
        groupScale: isMobile ? 0.85 : 1.1,
        planetOpacity: 0.0,
        ringsOpacity: 0.0,
        constellationOpacity: 0.0,
        techNetworkOpacity: 0.2 * (1 - stageP),
        projectTopologyOpacity: 0.95, // OS system planes & agent routes active
        creativePlanesOpacity: 0.0,
        starfieldOpacity: 0.5,
      };
    }

    // Stage 0.64 – 0.74: AEROINDEX (Navigation World, Radar Arcs, Altitude Vectors)
    if (p < 0.74) {
      const stageP = (p - 0.64) / 0.10;
      return {
        camPos: [0, 0.6 * stageP, 3.6 + stageP * 0.6] as [number, number, number],
        camLookAt: [0, 0, 0] as [number, number, number],
        groupPos: [isMobile ? 0 : 1.2, 0.2 * stageP, -0.2] as [number, number, number],
        groupRot: [0.6, 2.8 + stageP * 0.5, 0.1] as [number, number, number],
        groupScale: 1.05,
        planetOpacity: 0.0,
        ringsOpacity: 0.0,
        constellationOpacity: 0.0,
        techNetworkOpacity: 0.0,
        projectTopologyOpacity: 0.9,
        creativePlanesOpacity: 0.0,
        starfieldOpacity: 0.5,
      };
    }

    // Stage 0.74 – 0.82: COALINTEL (Camera Descends into Geological Strata)
    if (p < 0.82) {
      const stageP = (p - 0.74) / 0.08;
      return {
        camPos: [0, -0.8 * stageP, 4.2 - stageP * 0.4] as [number, number, number],
        camLookAt: [0, -0.4 * stageP, 0] as [number, number, number],
        groupPos: [0, -0.4 * stageP, -0.4] as [number, number, number],
        groupRot: [0.8 + stageP * 0.2, 3.2, 0] as [number, number, number],
        groupScale: 1.0,
        planetOpacity: 0.0,
        ringsOpacity: 0.0,
        constellationOpacity: 0.0,
        techNetworkOpacity: 0.0,
        projectTopologyOpacity: 0.9,
        creativePlanesOpacity: 0.0,
        starfieldOpacity: 0.4,
      };
    }

    // Stage 0.82 – 0.88: BLUEPRINT (Isometric Perspective Wireframe Planes)
    if (p < 0.88) {
      const stageP = (p - 0.82) / 0.06;
      return {
        camPos: [0.4 * stageP, 0.4 * stageP, 3.8 + stageP * 0.6] as [number, number, number],
        camLookAt: [0, 0, 0] as [number, number, number],
        groupPos: [0, 0.2 * stageP, -0.6] as [number, number, number],
        groupRot: [Math.PI / 4, Math.PI / 4, 0] as [number, number, number],
        groupScale: 0.95,
        planetOpacity: 0.0,
        ringsOpacity: 0.0,
        constellationOpacity: 0.0,
        techNetworkOpacity: 0.0,
        projectTopologyOpacity: 0.85,
        creativePlanesOpacity: stageP * 0.4,
        starfieldOpacity: 0.45,
      };
    }

    // Stage 0.88 – 0.94: CREATIVE LAB (Kinetic Media Planes & Chromatic Starfield)
    if (p < 0.94) {
      const stageP = (p - 0.88) / 0.06;
      return {
        camPos: [0, 0.2 * (1 - stageP), 4.4 + stageP * 0.6] as [number, number, number],
        camLookAt: [0, 0, 0] as [number, number, number],
        groupPos: [0, 0.2, -0.8] as [number, number, number],
        groupRot: [0.1, 3.6 + stageP * 0.5, -0.2] as [number, number, number],
        groupScale: 0.95,
        planetOpacity: 0.0,
        ringsOpacity: 0.0,
        constellationOpacity: 0.0,
        techNetworkOpacity: 0.0,
        projectTopologyOpacity: 0.1 * (1 - stageP),
        creativePlanesOpacity: 0.9, // Floating media planes shimmers
        starfieldOpacity: 0.85,
      };
    }

    // Stage 0.94 – 0.97: JOURNEY (Evolution Trajectory)
    if (p < 0.97) {
      return {
        camPos: [0, 0, 5.2] as [number, number, number],
        camLookAt: [0, 0, 0] as [number, number, number],
        groupPos: [0, 0, -0.8] as [number, number, number],
        groupRot: [0.2, 4.2, 0.1] as [number, number, number],
        groupScale: 0.85,
        planetOpacity: 0.0,
        ringsOpacity: 0.02,
        constellationOpacity: 0.3,
        techNetworkOpacity: 0.0,
        projectTopologyOpacity: 0.1,
        creativePlanesOpacity: 0.2,
        starfieldOpacity: 0.6,
      };
    }

    // Stage 0.97 – 1.00: SHUTDOWN (Disconnect Protocol & Collapse to Origin)
    const stageP = (p - 0.97) / 0.03;
    return {
      camPos: [0, 0, 5.2 + stageP * 2.5] as [number, number, number],
      camLookAt: [0, 0, 0] as [number, number, number],
      groupPos: [0, 0, -0.6 - stageP * 1.5] as [number, number, number],
      groupRot: [0.1, 4.8 + stageP * 1.0, 0] as [number, number, number],
      groupScale: 0.85 * (1 - stageP * 0.7),
      planetOpacity: 0.0,
      ringsOpacity: 0.0,
      constellationOpacity: 0.0,
      techNetworkOpacity: 0.0,
      projectTopologyOpacity: 0.0,
      creativePlanesOpacity: 0.0,
      starfieldOpacity: 0.6 * (1 - stageP) + 0.15,
    };
  }, [worldProgress, isMobile]);

  // Frame tick: Smooth continuous kinematics & Camera translation
  useFrame((state, delta) => {
    if (!masterGroupRef.current) return;

    const group = masterGroupRef.current;
    const lerpSpeed = Math.min(delta * 3.2, 0.14);

    // 1. Camera translation through 3D spatial coordinate space
    if (!reducedMotion) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetWorld.camPos[0], lerpSpeed);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetWorld.camPos[1], lerpSpeed);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetWorld.camPos[2], lerpSpeed);
      camera.lookAt(targetWorld.camLookAt[0], targetWorld.camLookAt[1], targetWorld.camLookAt[2]);
    }

    // 2. Master Group position, scale, and base rotation
    group.position.x = THREE.MathUtils.lerp(group.position.x, targetWorld.groupPos[0], lerpSpeed);
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetWorld.groupPos[1], lerpSpeed);
    group.position.z = THREE.MathUtils.lerp(group.position.z, targetWorld.groupPos[2], lerpSpeed);

    const currentScale = group.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetWorld.groupScale, lerpSpeed);
    group.scale.set(nextScale, nextScale, nextScale);

    // 3. Dynamic material opacity transitions
    if (planetMeshRef.current) {
      const mat = planetMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetWorld.planetOpacity, lerpSpeed);
      mat.transparent = true;
    }
    if (atmosphereRef.current) {
      const mat = atmosphereRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetWorld.planetOpacity * 0.08, lerpSpeed);
    }
    if (ring1Ref.current) {
      const mat = ring1Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetWorld.ringsOpacity, lerpSpeed);
    }
    if (ring2Ref.current) {
      const mat = ring2Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetWorld.ringsOpacity * 0.5, lerpSpeed);
    }
    if (ring3Ref.current) {
      const mat = ring3Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetWorld.ringsOpacity * 0.4, lerpSpeed);
    }
    if (satelliteRef.current) {
      const mat = satelliteRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetWorld.planetOpacity, lerpSpeed);
      mat.transparent = true;
    }
    if (starPointsRef.current) {
      const mat = starPointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetWorld.starfieldOpacity, lerpSpeed);
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
      if (ring1Ref.current) {
        ring1Ref.current.rotation.z += delta * 0.04;
      }
      if (ring2Ref.current) {
        ring2Ref.current.rotation.y -= delta * 0.035;
      }
      if (ring3Ref.current) {
        ring3Ref.current.rotation.z -= delta * 0.05;
      }

      // Orbiting satellite
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
      const targetParallaxX = disableParallax ? 0 : -pointer.y * pointerSensitivity * 0.3;
      const targetParallaxY = disableParallax ? 0 : pointer.x * pointerSensitivity * 0.4;

      group.rotation.x = THREE.MathUtils.lerp(
        group.rotation.x,
        targetWorld.groupRot[0] + targetParallaxX,
        lerpSpeed
      );
      group.rotation.y = THREE.MathUtils.lerp(
        group.rotation.y,
        targetWorld.groupRot[1] + targetParallaxY + time * 0.015,
        lerpSpeed
      );
      group.rotation.z = THREE.MathUtils.lerp(
        group.rotation.z,
        targetWorld.groupRot[2],
        lerpSpeed
      );
    }
  });

  return (
    <group ref={masterGroupRef} position={targetWorld.groupPos}>
      {/* =======================================================
          1. CELESTIAL PLANET CORE & ATMOSPHERE (IDENTITY SCENE)
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
            opacity={targetWorld.planetOpacity}
          />
        </mesh>

        {/* Luminous Outer Atmosphere Envelope */}
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[1.39, 32, 32]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={targetWorld.planetOpacity * 0.08}
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
            opacity={targetWorld.ringsOpacity}
          />
        </mesh>

        {/* Secondary Coordinate Ring */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
          <torusGeometry args={[3.2, 0.008, 16, 120]} />
          <meshBasicMaterial
            color="#E4E4E7"
            transparent
            opacity={targetWorld.ringsOpacity * 0.5}
          />
        </mesh>

        {/* Tertiary Inner Ring */}
        <mesh ref={ring3Ref} rotation={[Math.PI / 6, -Math.PI / 4, Math.PI / 8]}>
          <torusGeometry args={[1.85, 0.006, 16, 96]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={targetWorld.ringsOpacity * 0.4}
          />
        </mesh>

        {/* Orbiting Satellite Beacon */}
        <mesh ref={satelliteRef}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent={true}
            opacity={targetWorld.planetOpacity}
          />
        </mesh>
      </group>

      {/* =======================================================
          2. SPATIAL CARDINAL CONSTELLATION (ABOUT / WHO IS HENIL?)
      ======================================================= */}
      <group ref={constellationGroupRef}>
        {/* Radiating Links from Core to Cardinal Dimension Nodes */}
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
            opacity={targetWorld.constellationOpacity * 0.4}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>

        {/* 4 Cardinal Dimension Nodes */}
        {CARDINAL_NODES.map((node) => {
          const isNodeActive = activeDimension === node.id;
          return (
            <group key={node.id} position={node.pos}>
              {/* Core Beacon */}
              <mesh>
                <sphereGeometry args={[isNodeActive ? 0.09 : 0.055, 16, 16]} />
                <meshBasicMaterial
                  color={isNodeActive ? '#00F0FF' : node.color}
                  transparent
                  opacity={isNodeActive ? 1.0 : targetWorld.constellationOpacity}
                />
              </mesh>

              {/* Node Pulse Halo */}
              <mesh>
                <ringGeometry args={[0.08, 0.12, 24]} />
                <meshBasicMaterial
                  color={node.color}
                  transparent
                  opacity={isNodeActive ? 0.7 : targetWorld.constellationOpacity * 0.3}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* =======================================================
          3. LIVING TECHNOLOGY GRAPH (SKILLS / RELATIONS)
      ======================================================= */}
      <group ref={techNetworkGroupRef}>
        {/* Sub-network nodes branching out */}
        {[
          [-1.2, 1.4, -0.4],
          [1.4, 1.6, 0.3],
          [1.8, -1.4, -0.2],
          [-1.5, -1.2, 0.4],
          [0.8, 0.9, 0.6],
          [-0.7, -0.8, -0.5],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial
              color="#38BDF8"
              transparent
              opacity={targetWorld.techNetworkOpacity * 0.8}
            />
          </mesh>
        ))}
      </group>

      {/* =======================================================
          4. PROJECT WORLD TOPOLOGY (PROJECTS NARRATIVE)
      ======================================================= */}
      <group ref={projectTopologyGroupRef}>
        {/* Concentric Altitude Radar Arcs (AeroIndex) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.02, 64]} />
          <meshBasicMaterial
            color="#3B82F6"
            transparent
            opacity={targetWorld.projectTopologyOpacity * 0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.7, 2.715, 64]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={targetWorld.projectTopologyOpacity * 0.25}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Geological Strata Horizontal Planes (COALINTEL) */}
        <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.415, 48]} />
          <meshBasicMaterial
            color="#F59E0B"
            transparent
            opacity={targetWorld.projectTopologyOpacity * 0.25}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Architectural Perspective Plane Grid (Blueprint) */}
        <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 4]}>
          <ringGeometry args={[1.8, 1.815, 4]} />
          <meshBasicMaterial
            color="#E4E4E7"
            transparent
            opacity={targetWorld.projectTopologyOpacity * 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* =======================================================
          5. FLOATING MEDIA PLANES (CREATIVE LAB ARCHIVE)
      ======================================================= */}
      <group ref={creativePlanesGroupRef}>
        {[-1.4, 0, 1.4].map((x, idx) => (
          <mesh
            key={idx}
            position={[x, idx === 1 ? 0.3 : -0.2, (idx - 1) * 0.3]}
            rotation={[0, 0, (idx - 1) * 0.08]}
          >
            <planeGeometry args={[1.2, 0.75]} />
            <meshBasicMaterial
              color="#EC4899"
              transparent
              opacity={targetWorld.creativePlanesOpacity * 0.12}
              wireframe={true}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* =======================================================
          6. PERSISTENT STARFIELD (DYNAMIC INTENSITY PER SECTION)
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
          opacity={targetWorld.starfieldOpacity}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
