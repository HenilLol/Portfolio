import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useViewport } from '@/hooks/useViewport';

export interface CinematicOpening3DProps {
  progress: number; // 0.0 to 1.0 continuous scroll timeline
  pointerSensitivity?: number;
}

// Sample points along a line segment in 3D
function sampleLine3D(
  p1: [number, number, number],
  p2: [number, number, number],
  count: number
): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    points.push([
      p1[0] + (p2[0] - p1[0]) * t,
      p1[1] + (p2[1] - p1[1]) * t,
      p1[2] + (p2[2] - p1[2]) * t,
    ]);
  }
  return points;
}

// Generate volumetric 3D letter strokes in local coordinates
function generateLetterStrokes3D(char: string, totalPoints: number): [number, number, number][] {
  const w = 0.17;
  const h = 0.25;
  const d = 0.04;
  const segments: [[number, number, number], [number, number, number]][] = [];

  // Front & back face segments + cross-links for volumetric depth
  const addStroke = (x1: number, y1: number, x2: number, y2: number) => {
    segments.push([[x1, y1, -d], [x2, y2, -d]]);
    segments.push([[x1, y1, d], [x2, y2, d]]);
    segments.push([[x1, y1, -d], [x1, y1, d]]);
  };

  switch (char) {
    case 'H':
      addStroke(-w, -h, -w, h);
      addStroke(w, -h, w, h);
      addStroke(-w, 0, w, 0);
      break;
    case 'E':
      addStroke(-w, -h, -w, h);
      addStroke(-w, h, w, h);
      addStroke(-w, 0, w * 0.7, 0);
      addStroke(-w, -h, w, -h);
      break;
    case 'N':
      addStroke(-w, -h, -w, h);
      addStroke(-w, h, w, -h);
      addStroke(w, -h, w, h);
      break;
    case 'I':
      addStroke(0, -h, 0, h);
      addStroke(-w * 0.6, h, w * 0.6, h);
      addStroke(-w * 0.6, -h, w * 0.6, -h);
      break;
    case 'L':
      addStroke(-w, -h, -w, h);
      addStroke(-w, -h, w, -h);
      break;
    case 'P':
      addStroke(-w, -h, -w, h);
      addStroke(-w, h, w, h);
      addStroke(w, h, w, 0);
      addStroke(w, 0, -w, 0);
      break;
    case 'A':
      addStroke(-w, -h, 0, h);
      addStroke(0, h, w, -h);
      addStroke(-w * 0.6, -0.05, w * 0.6, -0.05);
      break;
    case 'T':
      addStroke(0, -h, 0, h);
      addStroke(-w, h, w, h);
      break;
    default:
      addStroke(0, -h, 0, h);
  }

  const pointsPerSeg = Math.max(2, Math.floor(totalPoints / segments.length));
  const result: [number, number, number][] = [];
  segments.forEach((seg) => {
    result.push(...sampleLine3D(seg[0], seg[1], pointsPerSeg));
  });

  while (result.length < totalPoints) {
    result.push(result[result.length - 1] || [0, 0, 0]);
  }
  return result.slice(0, totalPoints);
}

// 4 Cardinal Dimensions positions (matching spec layout)
const DIMENSION_CLUSTERS = [
  { id: 'engineering', pos: [-2.2, 1.5, 0.2] as [number, number, number], color: '#00F0FF' },
  { id: 'ai', pos: [2.3, 1.3, -0.3] as [number, number, number], color: '#38BDF8' },
  { id: 'systems', pos: [2.1, -1.6, 0.2] as [number, number, number], color: '#818CF8' },
  { id: 'creative', pos: [-2.3, -1.4, -0.2] as [number, number, number], color: '#EC4899' },
];

// 16 Relational Technology nodes
const TECH_NODES = [
  [-1.4, 1.1, 0.1],
  [1.5, 0.9, -0.1],
  [1.3, -1.1, 0.1],
  [-1.4, -0.9, -0.1],
  [-0.6, 1.7, -0.3],
  [0.7, 1.6, 0.3],
  [1.9, 0.2, 0.4],
  [1.7, -0.5, -0.4],
  [0.8, -1.8, 0.2],
  [-0.7, -1.7, -0.2],
  [-2.0, -0.4, 0.3],
  [-1.8, 0.3, -0.3],
  [0.0, 0.9, 0.5],
  [0.0, -0.9, 0.5],
  [0.8, 0.0, -0.4],
  [-0.8, 0.0, -0.4],
];

// 7 HENEOXY Subsystem beacon angles
const HENEOXY_ANGLES = [0, (Math.PI * 2) / 7, (Math.PI * 4) / 7, (Math.PI * 6) / 7, (Math.PI * 8) / 7, (Math.PI * 10) / 7, (Math.PI * 12) / 7];

export const CinematicOpening3D: React.FC<CinematicOpening3DProps> = ({
  progress,
  pointerSensitivity = 0.35,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const ringsGroupRef = useRef<THREE.Group>(null);
  const masterGroupRef = useRef<THREE.Group>(null);

  const reducedMotion = useReducedMotion();
  const { isMobile, hasTouch } = useViewport();
  const { camera, pointer } = useThree();

  const particleCount = useMemo(() => (isMobile ? 750 : 1500), [isMobile]);

  // Generate All Deterministic Morph Targets in typed Float32Arrays once
  const {
    posDormant,
    posHenil,
    posBreak,
    posSpatialIdentity,
    posTechNetwork,
    posHeneoxyCore,
    posHeneoxyWorld,
    colorsBase,
    lineIndices,
  } = useMemo(() => {
    const pDormant = new Float32Array(particleCount * 3);
    const pHenil = new Float32Array(particleCount * 3);
    const pBreak = new Float32Array(particleCount * 3);
    const pSpatialIdentity = new Float32Array(particleCount * 3);
    const pTechNetwork = new Float32Array(particleCount * 3);
    const pHeneoxyCore = new Float32Array(particleCount * 3);
    const pHeneoxyWorld = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const letterPointsCount = Math.floor((particleCount * 0.65) / 10);
    const firstName = ['H', 'E', 'N', 'I', 'L'];
    const lastName = ['P', 'A', 'T', 'E', 'L'];
    const letterSpacing = isMobile ? 0.42 : 0.54;

    let pIdx = 0;

    // Sample HENIL (Row 1: Y = +0.34)
    firstName.forEach((char, lIdx) => {
      const xOffset = (lIdx - 2) * letterSpacing;
      const yOffset = isMobile ? 0.36 : 0.34;
      const strokes = generateLetterStrokes3D(char, letterPointsCount);
      strokes.forEach(([x, y, z]) => {
        if (pIdx < particleCount) {
          pHenil[pIdx * 3] = xOffset + x;
          pHenil[pIdx * 3 + 1] = yOffset + y;
          pHenil[pIdx * 3 + 2] = z + (Math.random() - 0.5) * 0.04;
          pIdx++;
        }
      });
    });

    // Sample PATEL (Row 2: Y = -0.34)
    lastName.forEach((char, lIdx) => {
      const xOffset = (lIdx - 2) * letterSpacing;
      const yOffset = isMobile ? -0.36 : -0.34;
      const strokes = generateLetterStrokes3D(char, letterPointsCount);
      strokes.forEach(([x, y, z]) => {
        if (pIdx < particleCount) {
          pHenil[pIdx * 3] = xOffset + x;
          pHenil[pIdx * 3 + 1] = yOffset + y;
          pHenil[pIdx * 3 + 2] = z + (Math.random() - 0.5) * 0.04;
          pIdx++;
        }
      });
    });

    // Remaining points are ambient coordinate filaments around the identity
    while (pIdx < particleCount) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.3 + Math.random() * 2.5;
      pHenil[pIdx * 3] = Math.cos(angle) * r;
      pHenil[pIdx * 3 + 1] = Math.sin(angle) * (r * 0.5);
      pHenil[pIdx * 3 + 2] = -0.3 - Math.random() * 2.0;
      pIdx++;
    }

    // Seed all morph targets for each particle
    for (let i = 0; i < particleCount; i++) {
      const idx3 = i * 3;

      // 1. DORMANT: Subtle celestial filament seed at origin
      const dAngle = Math.random() * Math.PI * 2;
      const dRadius = 0.05 + Math.random() * 0.35;
      pDormant[idx3] = Math.cos(dAngle) * dRadius;
      pDormant[idx3 + 1] = Math.sin(dAngle) * dRadius;
      pDormant[idx3 + 2] = (Math.random() - 0.5) * 0.25;

      // 2. BREAK: Violent 3D explosive scattering outward
      const bTheta = Math.random() * Math.PI * 2;
      const bPhi = Math.acos(Math.random() * 2 - 1);
      const bDist = 2.2 + Math.random() * 4.4;
      pBreak[idx3] = bDist * Math.sin(bPhi) * Math.cos(bTheta);
      pBreak[idx3 + 1] = bDist * Math.sin(bPhi) * Math.sin(bTheta);
      pBreak[idx3 + 2] = bDist * Math.cos(bPhi);

      // 3. SPATIAL IDENTITY: 4 Dimension clusters + central HENIL core
      const clusterIdx = i % 5;
      const sTheta = Math.random() * Math.PI * 2;
      const sPhi = Math.acos(Math.random() * 2 - 1);
      const sRadius = 0.1 + Math.random() * 0.35;
      let center = [0, 0, 0];
      if (clusterIdx > 0) {
        center = DIMENSION_CLUSTERS[clusterIdx - 1].pos;
      }
      pSpatialIdentity[idx3] = center[0] + sRadius * Math.sin(sPhi) * Math.cos(sTheta);
      pSpatialIdentity[idx3 + 1] = center[1] + sRadius * Math.sin(sPhi) * Math.sin(sTheta);
      pSpatialIdentity[idx3 + 2] = center[2] + sRadius * Math.cos(sPhi);

      // 4. TECH NETWORK: Distribute over 16 relational network hubs
      const hub = TECH_NODES[i % TECH_NODES.length];
      const tAngle = Math.random() * Math.PI * 2;
      const tRadius = 0.06 + Math.random() * 0.25;
      pTechNetwork[idx3] = hub[0] + Math.cos(tAngle) * tRadius;
      pTechNetwork[idx3 + 1] = hub[1] + Math.sin(tAngle) * tRadius;
      pTechNetwork[idx3 + 2] = hub[2] + (Math.random() - 0.5) * 0.2;

      // 5. HENEOXY CORE (Singularity collapse)
      const spiralAngle = (i / particleCount) * Math.PI * 10;
      const spiralRadius = 0.04 + (1 - i / particleCount) * 0.7;
      pHeneoxyCore[idx3] = Math.cos(spiralAngle) * spiralRadius;
      pHeneoxyCore[idx3 + 1] = Math.sin(spiralAngle) * spiralRadius;
      pHeneoxyCore[idx3 + 2] = (Math.random() - 0.5) * 0.12;

      // 6. HENEOXY WORLD: Concentric OS rings + 7 subsystem beacons
      const subIdx = i % (HENEOXY_ANGLES.length + 3);
      if (subIdx < 3) {
        const ringR = subIdx === 0 ? 1.2 : subIdx === 1 ? 1.95 : 2.65;
        const ringA = Math.random() * Math.PI * 2;
        pHeneoxyWorld[idx3] = Math.cos(ringA) * ringR;
        pHeneoxyWorld[idx3 + 1] = Math.sin(ringA) * ringR;
        pHeneoxyWorld[idx3 + 2] = (Math.random() - 0.5) * 0.1;
      } else {
        const baseAngle = HENEOXY_ANGLES[subIdx - 3];
        const beaconR = 1.95 + (Math.random() - 0.5) * 0.3;
        const angleOffset = (Math.random() - 0.5) * 0.25;
        pHeneoxyWorld[idx3] = Math.cos(baseAngle + angleOffset) * beaconR;
        pHeneoxyWorld[idx3 + 1] = Math.sin(baseAngle + angleOffset) * beaconR;
        pHeneoxyWorld[idx3 + 2] = (Math.random() - 0.5) * 0.18;
      }

      // Base Colors: Cyan, Sky Blue, Indigo, and White
      const cDice = Math.random();
      if (cDice > 0.55) {
        colors[idx3] = 0.0;
        colors[idx3 + 1] = 0.94; // Cyan #00F0FF
        colors[idx3 + 2] = 1.0;
      } else if (cDice > 0.25) {
        colors[idx3] = 0.22;
        colors[idx3 + 1] = 0.74; // Sky Blue #38BDF8
        colors[idx3 + 2] = 0.97;
      } else {
        colors[idx3] = 0.96;
        colors[idx3 + 1] = 0.98; // White
        colors[idx3 + 2] = 1.0;
      }
    }

    // Connect lines between cardinal nodes and network hubs
    const indices: number[] = [];
    for (let c = 0; c < 4; c++) {
      indices.push(0, (c + 1) * Math.floor(particleCount / 5));
      indices.push(
        (c + 1) * Math.floor(particleCount / 5),
        (((c + 1) % 4) + 1) * Math.floor(particleCount / 5)
      );
    }
    for (let t = 0; t < TECH_NODES.length; t++) {
      const next = (t + 1) % TECH_NODES.length;
      indices.push(t * 30, next * 30);
    }

    return {
      posDormant: pDormant,
      posHenil: pHenil,
      posBreak: pBreak,
      posSpatialIdentity: pSpatialIdentity,
      posTechNetwork: pTechNetwork,
      posHeneoxyCore: pHeneoxyCore,
      posHeneoxyWorld: pHeneoxyWorld,
      colorsBase: colors,
      lineIndices: new Uint16Array(indices),
    };
  }, [particleCount, isMobile]);

  // Current typed array buffers for points and lines
  const currentPositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const linePositions = useMemo(() => new Float32Array(lineIndices.length * 3), [lineIndices.length]);

  // Camera trajectory parameters driven by progress (0.00 to 1.00)
  const cameraTarget = useMemo(() => {
    const p = Math.max(0, Math.min(1, progress));

    // Scene A: DORMANT (0.00 – 0.10)
    if (p < 0.1) {
      return {
        pos: [0, 0, 7.5] as [number, number, number],
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.08,
        pointSize: isMobile ? 0.026 : 0.034,
      };
    }
    // Scene B: IDENTITY CONSTRUCTION & BREATHING (0.10 – 0.34)
    if (p < 0.34) {
      const s = (p - 0.1) / 0.24;
      return {
        pos: [0, 0, 7.5 - s * 2.7] as [number, number, number], // Push camera into 4.8
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.15 + s * 0.15,
        pointSize: isMobile ? 0.028 : 0.038,
      };
    }
    // Scene C: IDENTITY BREAK & DISPERSION (0.34 – 0.52)
    if (p < 0.52) {
      const s = (p - 0.34) / 0.18;
      return {
        pos: [0.5 * s, -0.25 * s, 4.8 - s * 0.6] as [number, number, number],
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.3 * (1 - s),
        pointSize: isMobile ? 0.024 : 0.032,
      };
    }
    // Scene D: SPATIAL IDENTITY CONSTELLATION (0.52 – 0.70)
    if (p < 0.7) {
      const s = (p - 0.52) / 0.18;
      return {
        pos: [-0.8 * s, 0.35 * s, 4.2 + s * 0.5] as [number, number, number],
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.75,
        pointSize: isMobile ? 0.03 : 0.04,
      };
    }
    // Scene E: TECHNOLOGY NETWORK (0.70 – 0.86)
    if (p < 0.86) {
      const s = (p - 0.7) / 0.16;
      return {
        pos: [0, -0.4 * s, 4.7 + s * 0.5] as [number, number, number],
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.85,
        pointSize: isMobile ? 0.028 : 0.036,
      };
    }
    // Scene F: HENEOXY EMERGENCE (0.86 – 1.00)
    const s = (p - 0.86) / 0.14;
    return {
      pos: [0.5 * (1 - s), -0.2 * s, 3.2 + s * 0.8] as [number, number, number],
      lookAt: [0, 0, 0] as [number, number, number],
      lineOpacity: 0.65,
      pointSize: isMobile ? 0.03 : 0.04,
    };
  }, [progress, isMobile]);

  // Frame tick: continuous deterministic particle & camera kinematics
  useFrame((state, delta) => {
    if (!pointsRef.current || !masterGroupRef.current) return;

    const p = Math.max(0, Math.min(1, progress));
    const time = state.clock.getElapsedTime();
    const lerpSpeed = Math.min(delta * 4.0, 0.16);

    // Smooth camera choreography
    if (!reducedMotion) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraTarget.pos[0], lerpSpeed);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, cameraTarget.pos[1], lerpSpeed);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraTarget.pos[2], lerpSpeed);
      camera.lookAt(cameraTarget.lookAt[0], cameraTarget.lookAt[1], cameraTarget.lookAt[2]);
    }

    // Pointer parallax response
    if (!isMobile && !hasTouch && !reducedMotion) {
      const targetRotX = -pointer.y * pointerSensitivity * 0.25;
      const targetRotY = pointer.x * pointerSensitivity * 0.35;
      masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.x,
        targetRotX,
        lerpSpeed
      );
      masterGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.y,
        targetRotY,
        lerpSpeed
      );
    }

    // Stage source and destination interpolation selection
    let fromTarget = posDormant;
    let toTarget = posHenil;
    let stageT = 0;

    if (p < 0.1) {
      fromTarget = posDormant;
      toTarget = posHenil;
      stageT = 0;
    } else if (p < 0.34) {
      fromTarget = posDormant;
      toTarget = posHenil;
      stageT = (p - 0.1) / 0.24;
    } else if (p < 0.52) {
      fromTarget = posHenil;
      toTarget = posBreak;
      stageT = (p - 0.34) / 0.18;
    } else if (p < 0.7) {
      fromTarget = posBreak;
      toTarget = posSpatialIdentity;
      stageT = (p - 0.52) / 0.18;
    } else if (p < 0.86) {
      fromTarget = posSpatialIdentity;
      toTarget = posTechNetwork;
      stageT = (p - 0.7) / 0.16;
    } else if (p < 0.93) {
      fromTarget = posTechNetwork;
      toTarget = posHeneoxyCore;
      stageT = (p - 0.86) / 0.07;
    } else {
      fromTarget = posHeneoxyCore;
      toTarget = posHeneoxyWorld;
      stageT = (p - 0.93) / 0.07;
    }

    // Smooth Hermite curve
    const smoothT = stageT * stageT * (3 - 2 * stageT);

    const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArr = positionsAttr.array as Float32Array;

    const noiseFreq = p > 0.34 && p < 0.52 ? 3.5 : p >= 0.86 && p < 0.93 ? 5.5 : 1.2;
    const noiseAmp = p > 0.34 && p < 0.52 ? 0.08 : p >= 0.86 && p < 0.93 ? 0.04 : 0.015;

    for (let i = 0; i < particleCount; i++) {
      const idx3 = i * 3;
      const x1 = fromTarget[idx3];
      const y1 = fromTarget[idx3 + 1];
      const z1 = fromTarget[idx3 + 2];

      const x2 = toTarget[idx3];
      const y2 = toTarget[idx3 + 1];
      const z2 = toTarget[idx3 + 2];

      const targetX = x1 + (x2 - x1) * smoothT;
      const targetY = y1 + (y2 - y1) * smoothT;
      const targetZ = z1 + (z2 - z1) * smoothT;

      // Subtle organic breathing oscillation
      const subtleWobble = Math.sin(time * noiseFreq + i * 0.1) * noiseAmp;

      // Pointer spring repulsion in identity & break stages
      let mouseRepelX = 0;
      let mouseRepelY = 0;
      if (!isMobile && !hasTouch && p > 0.1 && p < 0.7) {
        const dx = targetX - pointer.x * 3.5;
        const dy = targetY - pointer.y * 2.5;
        const distSq = dx * dx + dy * dy;
        if (distSq < 1.0 && distSq > 0.001) {
          const force = (1.0 - distSq) * 0.2;
          mouseRepelX = (dx / Math.sqrt(distSq)) * force;
          mouseRepelY = (dy / Math.sqrt(distSq)) * force;
        }
      }

      posArr[idx3] = targetX + mouseRepelX + subtleWobble;
      posArr[idx3 + 1] = targetY + mouseRepelY + subtleWobble;
      posArr[idx3 + 2] = targetZ + (p >= 0.86 && p < 0.93 ? Math.cos(time * 8 + i) * 0.04 : 0);
    }

    positionsAttr.needsUpdate = true;

    // Update lines geometry endpoints
    if (linesRef.current) {
      const linesAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const lineArr = linesAttr.array as Float32Array;
      for (let l = 0; l < lineIndices.length; l++) {
        const pIndex = lineIndices[l];
        lineArr[l * 3] = posArr[pIndex * 3];
        lineArr[l * 3 + 1] = posArr[pIndex * 3 + 1];
        lineArr[l * 3 + 2] = posArr[pIndex * 3 + 2];
      }
      linesAttr.needsUpdate = true;

      const lineMat = linesRef.current.material as THREE.LineBasicMaterial;
      lineMat.opacity = THREE.MathUtils.lerp(lineMat.opacity, cameraTarget.lineOpacity, lerpSpeed);
    }

    // Rotate HENEOXY rings in final scene
    if (ringsGroupRef.current && p > 0.88) {
      ringsGroupRef.current.rotation.z += delta * 0.22;
    }
  });

  return (
    <group ref={masterGroupRef}>
      {/* 1. MASTER SHARED PARTICLE BUFFER */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[currentPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colorsBase, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={cameraTarget.pointSize}
          vertexColors
          transparent
          opacity={0.92}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. DYNAMIC CONNECTING LINE SEGMENTS */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00F0FF"
          transparent
          opacity={cameraTarget.lineOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* 3. HENEOXY ARCHITECTURAL OS RINGS */}
      <group ref={ringsGroupRef}>
        <mesh rotation={[Math.PI / 2.6, 0, 0]}>
          <ringGeometry args={[1.93, 1.97, 64]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={progress > 0.88 ? (progress - 0.88) * 3.0 * 0.4 : 0}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 3.2, Math.PI / 6, 0]}>
          <ringGeometry args={[2.62, 2.65, 64]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={progress > 0.88 ? (progress - 0.88) * 3.0 * 0.3 : 0}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

export default CinematicOpening3D;
