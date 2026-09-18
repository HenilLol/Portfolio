import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useViewport } from '@/hooks/useViewport';

export interface CinematicProofSequence3DProps {
  progress: number; // 0.0 to 1.0 continuous scroll timeline
  activeDimension?: string | null;
  activeHeneoxySubsystem?: string | null;
  pointerSensitivity?: number;
}

// Helper: Sample N points along line segment [p1, p2]
function sampleLine(p1: [number, number], p2: [number, number], count: number): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    points.push([p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t]);
  }
  return points;
}

// Generate letter strokes in local letter coordinates [-0.2, 0.2] x [-0.28, 0.28]
function generateLetterStrokes(char: string, totalPoints: number): [number, number][] {
  const w = 0.18;
  const h = 0.26;
  const segments: [[number, number], [number, number]][] = [];

  switch (char) {
    case 'H':
      segments.push([[-w, -h], [-w, h]]);
      segments.push([[w, -h], [w, h]]);
      segments.push([[-w, 0], [w, 0]]);
      break;
    case 'E':
      segments.push([[-w, -h], [-w, h]]);
      segments.push([[-w, h], [w, h]]);
      segments.push([[-w, 0], [w * 0.7, 0]]);
      segments.push([[-w, -h], [w, -h]]);
      break;
    case 'N':
      segments.push([[-w, -h], [-w, h]]);
      segments.push([[-w, h], [w, -h]]);
      segments.push([[w, -h], [w, h]]);
      break;
    case 'I':
      segments.push([[0, -h], [0, h]]);
      segments.push([[-w * 0.6, h], [w * 0.6, h]]);
      segments.push([[-w * 0.6, -h], [w * 0.6, -h]]);
      break;
    case 'L':
      segments.push([[-w, -h], [-w, h]]);
      segments.push([[-w, -h], [w, -h]]);
      break;
    case 'P':
      segments.push([[-w, -h], [-w, h]]);
      segments.push([[-w, h], [w, h]]);
      segments.push([[w, h], [w, 0]]);
      segments.push([[w, 0], [-w, 0]]);
      break;
    case 'A':
      segments.push([[-w, -h], [0, h]]);
      segments.push([[0, h], [w, -h]]);
      segments.push([[-w * 0.6, -0.05], [w * 0.6, -0.05]]);
      break;
    case 'T':
      segments.push([[0, -h], [0, h]]);
      segments.push([[-w, h], [w, h]]);
      break;
    default:
      segments.push([[0, -h], [0, h]]);
  }

  const pointsPerSeg = Math.max(2, Math.floor(totalPoints / segments.length));
  const result: [number, number][] = [];
  segments.forEach((seg) => {
    result.push(...sampleLine(seg[0], seg[1], pointsPerSeg));
  });

  while (result.length < totalPoints) {
    result.push(result[result.length - 1] || [0, 0]);
  }
  return result.slice(0, totalPoints);
}

// 4 Cardinal Dimensions configuration
const CARDINAL_NODES = [
  { id: 'engineering', label: 'ENGINEERING', pos: [0, 2.1, 0.2] as [number, number, number], color: '#00F0FF' },
  { id: 'ai', label: 'AI', pos: [2.5, 0.0, -0.3] as [number, number, number], color: '#38BDF8' },
  { id: 'systems', label: 'SYSTEMS', pos: [0, -2.1, 0.2] as [number, number, number], color: '#818CF8' },
  { id: 'creative', label: 'CREATIVE', pos: [-2.5, 0.0, -0.3] as [number, number, number], color: '#EC4899' },
];

// 16 Relational Technology nodes
const TECH_GRAPH_NODES = [
  // 4 Core anchors
  [0, 1.4, 0.3],
  [1.6, 0.2, -0.2],
  [0, -1.4, 0.3],
  [-1.6, 0.2, -0.2],
  // 12 Connected specialized nodes
  [-0.9, 1.8, -0.4],
  [0.9, 1.8, 0.4],
  [2.1, 1.0, 0.2],
  [2.2, -0.8, -0.3],
  [1.1, -1.9, 0.3],
  [-1.1, -1.9, -0.3],
  [-2.2, -0.8, 0.2],
  [-2.1, 1.0, -0.2],
  [0.6, 0.7, 0.5],
  [-0.6, -0.7, 0.5],
  [0.7, -0.7, -0.4],
  [-0.7, 0.7, -0.4],
];

// 7 HENEOXY Subsystems around central OS coordinator
const HENEOXY_SUBSYSTEMS = [
  { id: 'SYSTEM', angle: 0 },
  { id: 'AGENTS', angle: (Math.PI * 2 * 1) / 7 },
  { id: 'MEMORY', angle: (Math.PI * 2 * 2) / 7 },
  { id: 'CONTEXT', angle: (Math.PI * 2 * 3) / 7 },
  { id: 'TOOLS', angle: (Math.PI * 2 * 4) / 7 },
  { id: 'SECURITY', angle: (Math.PI * 2 * 5) / 7 },
  { id: 'ARCHITECTURE', angle: (Math.PI * 2 * 6) / 7 },
];

export const CinematicProofSequence3D: React.FC<CinematicProofSequence3DProps> = ({
  progress,
  activeDimension = null,
  activeHeneoxySubsystem = null,
  pointerSensitivity = 0.35,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const ringsGroupRef = useRef<THREE.Group>(null);
  const masterGroupRef = useRef<THREE.Group>(null);

  const reducedMotion = useReducedMotion();
  const { isMobile, hasTouch } = useViewport();
  const { camera, pointer } = useThree();

  const particleCount = useMemo(() => (isMobile ? 850 : 1800), [isMobile]);

  // Generate All Morph Targets in static Float32Arrays once
  const {
    posDormant,
    posHenil,
    posBreak,
    posConstellation,
    posTechNetwork,
    posCollapse,
    posHeneoxy,
    colorsBase,
    lineIndices,
  } = useMemo(() => {
    const pDormant = new Float32Array(particleCount * 3);
    const pHenil = new Float32Array(particleCount * 3);
    const pBreak = new Float32Array(particleCount * 3);
    const pConstellation = new Float32Array(particleCount * 3);
    const pTechNetwork = new Float32Array(particleCount * 3);
    const pCollapse = new Float32Array(particleCount * 3);
    const pHeneoxy = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Letter sampling setup
    const letterPointsCount = Math.floor((particleCount * 0.6) / 10);
    const firstName = ['H', 'E', 'N', 'I', 'L'];
    const lastName = ['P', 'A', 'T', 'E', 'L'];
    const letterSpacing = isMobile ? 0.44 : 0.56;

    let pIdx = 0;

    // Sample HENIL (Row 1: Y = +0.36)
    firstName.forEach((char, lIdx) => {
      const xOffset = (lIdx - 2) * letterSpacing;
      const yOffset = isMobile ? 0.38 : 0.36;
      const strokes = generateLetterStrokes(char, letterPointsCount);
      strokes.forEach(([x, y]) => {
        if (pIdx < particleCount) {
          pHenil[pIdx * 3] = xOffset + x;
          pHenil[pIdx * 3 + 1] = yOffset + y;
          pHenil[pIdx * 3 + 2] = (Math.random() - 0.5) * 0.08;
          pIdx++;
        }
      });
    });

    // Sample PATEL (Row 2: Y = -0.36)
    lastName.forEach((char, lIdx) => {
      const xOffset = (lIdx - 2) * letterSpacing;
      const yOffset = isMobile ? -0.38 : -0.36;
      const strokes = generateLetterStrokes(char, letterPointsCount);
      strokes.forEach(([x, y]) => {
        if (pIdx < particleCount) {
          pHenil[pIdx * 3] = xOffset + x;
          pHenil[pIdx * 3 + 1] = yOffset + y;
          pHenil[pIdx * 3 + 2] = (Math.random() - 0.5) * 0.08;
          pIdx++;
        }
      });
    });

    // Remaining points are atmospheric depth field surrounding the name
    while (pIdx < particleCount) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.4 + Math.random() * 2.8;
      pHenil[pIdx * 3] = Math.cos(angle) * r;
      pHenil[pIdx * 3 + 1] = Math.sin(angle) * (r * 0.6);
      pHenil[pIdx * 3 + 2] = -0.4 - Math.random() * 2.2;
      pIdx++;
    }

    // Initialize all other morph targets for each particle
    for (let i = 0; i < particleCount; i++) {
      // 1. DORMANT: Concentrated singular core with subtle orbital radius
      const dAngle = Math.random() * Math.PI * 2;
      const dR = 0.05 + Math.random() * 0.45;
      pDormant[i * 3] = Math.cos(dAngle) * dR;
      pDormant[i * 3 + 1] = Math.sin(dAngle) * dR;
      pDormant[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

      // 2. BREAK: Violent 3D explosive shatter outwards
      const bTheta = Math.random() * Math.PI * 2;
      const bPhi = Math.acos(Math.random() * 2 - 1);
      const bDist = 2.4 + Math.random() * 4.8;
      pBreak[i * 3] = bDist * Math.sin(bPhi) * Math.cos(bTheta);
      pBreak[i * 3 + 1] = bDist * Math.sin(bPhi) * Math.sin(bTheta);
      pBreak[i * 3 + 2] = bDist * Math.cos(bPhi);

      // 3. CONSTELLATION: Reorganize into 4 Cardinal Spheres + Center Core
      const clusterIdx = i % 5; // 0: Core, 1..4: Cardinal nodes
      const cTheta = Math.random() * Math.PI * 2;
      const cPhi = Math.acos(Math.random() * 2 - 1);
      const cRadius = 0.12 + Math.random() * 0.32;
      let center = [0, 0, 0];
      if (clusterIdx > 0) {
        center = CARDINAL_NODES[clusterIdx - 1].pos;
      }
      pConstellation[i * 3] = center[0] + cRadius * Math.sin(cPhi) * Math.cos(cTheta);
      pConstellation[i * 3 + 1] = center[1] + cRadius * Math.sin(cPhi) * Math.sin(cTheta);
      pConstellation[i * 3 + 2] = center[2] + cRadius * Math.cos(cPhi);

      // 4. TECH NETWORK: Distribute over 16 relational network hubs
      const hubIdx = i % TECH_GRAPH_NODES.length;
      const hub = TECH_GRAPH_NODES[hubIdx];
      const tAngle = Math.random() * Math.PI * 2;
      const tR = 0.08 + Math.random() * 0.28;
      pTechNetwork[i * 3] = hub[0] + Math.cos(tAngle) * tR;
      pTechNetwork[i * 3 + 1] = hub[1] + Math.sin(tAngle) * tR;
      pTechNetwork[i * 3 + 2] = hub[2] + (Math.random() - 0.5) * 0.2;

      // 5. COLLAPSE: Accretion vortex spiraling into origin
      const spiralT = (i / particleCount) * Math.PI * 8;
      const spiralR = 0.05 + (1 - i / particleCount) * 0.9;
      pCollapse[i * 3] = Math.cos(spiralT) * spiralR;
      pCollapse[i * 3 + 1] = Math.sin(spiralT) * spiralR;
      pCollapse[i * 3 + 2] = (Math.random() - 0.5) * 0.15;

      // 6. HENEOXY: OS concentric rings + 7 subsystem beacons
      const subIdx = i % (HENEOXY_SUBSYSTEMS.length + 3);
      if (subIdx < 3) {
        // Concentric OS system rings
        const ringR = subIdx === 0 ? 1.2 : subIdx === 1 ? 2.0 : 2.7;
        const ringAngle = Math.random() * Math.PI * 2;
        pHeneoxy[i * 3] = Math.cos(ringAngle) * ringR;
        pHeneoxy[i * 3 + 1] = Math.sin(ringAngle) * ringR;
        pHeneoxy[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
      } else {
        // Subsystem node cluster
        const sys = HENEOXY_SUBSYSTEMS[subIdx - 3];
        const sysR = 2.0;
        const baseAngle = sys.angle;
        const offsetR = (Math.random() - 0.5) * 0.35;
        const offsetA = (Math.random() - 0.5) * 0.35;
        pHeneoxy[i * 3] = Math.cos(baseAngle + offsetA) * (sysR + offsetR);
        pHeneoxy[i * 3 + 1] = Math.sin(baseAngle + offsetA) * (sysR + offsetR);
        pHeneoxy[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      }

      // Base Colors: Gradient from Cyan to Sky Blue to White
      const cDice = Math.random();
      if (cDice > 0.6) {
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 0.94; // Cyan #00F0FF
        colors[i * 3 + 2] = 1.0;
      } else if (cDice > 0.2) {
        colors[i * 3] = 0.22;
        colors[i * 3 + 1] = 0.74; // Sky #38BDF8
        colors[i * 3 + 2] = 0.97;
      } else {
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.98; // White
        colors[i * 3 + 2] = 1.0;
      }
    }

    // Dynamic Line Connections indices
    const indices: number[] = [];
    // Cardinal nodes connection
    for (let i = 0; i < 4; i++) {
      indices.push(0, (i + 1) * Math.floor(particleCount / 5));
      indices.push(
        (i + 1) * Math.floor(particleCount / 5),
        (((i + 1) % 4) + 1) * Math.floor(particleCount / 5)
      );
    }
    // Tech network connections between nodes
    for (let i = 0; i < TECH_GRAPH_NODES.length; i++) {
      const nextIdx = (i + 1) % TECH_GRAPH_NODES.length;
      const crossIdx = (i + 4) % TECH_GRAPH_NODES.length;
      indices.push(i * 40, nextIdx * 40);
      indices.push(i * 40, crossIdx * 40);
    }

    return {
      posDormant: pDormant,
      posHenil: pHenil,
      posBreak: pBreak,
      posConstellation: pConstellation,
      posTechNetwork: pTechNetwork,
      posCollapse: pCollapse,
      posHeneoxy: pHeneoxy,
      colorsBase: colors,
      lineIndices: new Uint16Array(indices),
    };
  }, [particleCount, isMobile]);

  // Dynamic Current Float32Array for Points & Lines
  const currentPositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const linePositions = useMemo(() => new Float32Array(lineIndices.length * 3), [lineIndices.length]);

  // Pre-calculated target camera path
  const cameraTarget = useMemo(() => {
    const p = Math.max(0, Math.min(1, progress));

    // 1. DORMANT (0.00 - 0.08)
    if (p < 0.08) {
      return {
        pos: [0, 0, 7.2] as [number, number, number],
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.1,
        pointSize: isMobile ? 0.025 : 0.034,
      };
    }
    // 2. HENIL PATEL (0.08 - 0.22)
    if (p < 0.22) {
      const s = (p - 0.08) / 0.14;
      return {
        pos: [0, 0, 7.2 - s * 2.2] as [number, number, number], // Push camera in to 5.0
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.15 + s * 0.1,
        pointSize: isMobile ? 0.028 : 0.038,
      };
    }
    // 3. IDENTITY BREAKS & PARTICLES (0.22 - 0.36)
    if (p < 0.36) {
      const s = (p - 0.22) / 0.14;
      return {
        pos: [0.6 * s, -0.3 * s, 5.0 - s * 0.8] as [number, number, number],
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.25 * (1 - s),
        pointSize: isMobile ? 0.024 : 0.032,
      };
    }
    // 4. CONSTELLATION (0.36 - 0.52)
    if (p < 0.52) {
      const s = (p - 0.36) / 0.16;
      return {
        pos: [-0.9 * s, 0.4 * s, 4.2 + s * 0.6] as [number, number, number],
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.7,
        pointSize: isMobile ? 0.03 : 0.04,
      };
    }
    // 5. TECH NETWORK (0.52 - 0.68)
    if (p < 0.68) {
      const s = (p - 0.52) / 0.16;
      return {
        pos: [0, -0.5 * s, 4.8 + s * 0.6] as [number, number, number],
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.85,
        pointSize: isMobile ? 0.028 : 0.036,
      };
    }
    // 6. NETWORK COLLAPSE (0.68 - 0.80)
    if (p < 0.8) {
      const s = (p - 0.68) / 0.12;
      return {
        pos: [0, 0, 5.4 - s * 2.4] as [number, number, number], // Dive camera into singularity at 3.0
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.9 * (1 - s),
        pointSize: isMobile ? 0.032 : 0.045,
      };
    }
    // 7. HENEOXY FORMS & TAKES OVER (0.80 - 1.00)
    const s = (p - 0.8) / 0.2;
    return {
      pos: [0.6 * (1 - s), -0.2 * s, 3.0 + s * 1.0] as [number, number, number],
      lookAt: [0, 0, 0] as [number, number, number],
      lineOpacity: 0.6,
      pointSize: isMobile ? 0.03 : 0.04,
    };
  }, [progress, isMobile]);

  // Frame tick: High-performance particle interpolation in typed arrays
  useFrame((state, delta) => {
    if (!pointsRef.current || !masterGroupRef.current) return;

    const p = Math.max(0, Math.min(1, progress));
    const time = state.clock.getElapsedTime();
    const lerpSpeed = Math.min(delta * 4.0, 0.16);

    // Smooth camera positioning
    if (!reducedMotion) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraTarget.pos[0], lerpSpeed);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, cameraTarget.pos[1], lerpSpeed);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraTarget.pos[2], lerpSpeed);
      camera.lookAt(cameraTarget.lookAt[0], cameraTarget.lookAt[1], cameraTarget.lookAt[2]);
    }

    // Pointer parallax response
    if (!isMobile && !hasTouch && !reducedMotion) {
      const targetRotX = -pointer.y * pointerSensitivity * 0.3;
      const targetRotY = pointer.x * pointerSensitivity * 0.4;
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

    // Determine morph target source and destination based on stage
    let fromTarget = posDormant;
    let toTarget = posHenil;
    let stageT = 0;

    if (p < 0.08) {
      fromTarget = posDormant;
      toTarget = posHenil;
      stageT = 0;
    } else if (p < 0.22) {
      fromTarget = posDormant;
      toTarget = posHenil;
      stageT = (p - 0.08) / 0.14;
    } else if (p < 0.36) {
      fromTarget = posHenil;
      toTarget = posBreak;
      stageT = (p - 0.22) / 0.14;
    } else if (p < 0.52) {
      fromTarget = posBreak;
      toTarget = posConstellation;
      stageT = (p - 0.36) / 0.16;
    } else if (p < 0.68) {
      fromTarget = posConstellation;
      toTarget = posTechNetwork;
      stageT = (p - 0.52) / 0.16;
    } else if (p < 0.8) {
      fromTarget = posTechNetwork;
      toTarget = posCollapse;
      stageT = (p - 0.68) / 0.12;
    } else {
      fromTarget = posCollapse;
      toTarget = posHeneoxy;
      stageT = (p - 0.8) / 0.2;
    }

    // Smoothstep easing for stageT
    const smoothT = stageT * stageT * (3 - 2 * stageT);

    const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArr = positionsAttr.array as Float32Array;

    // Fluid motion noise frequencies
    const noiseFreq = p > 0.22 && p < 0.36 ? 3.5 : p >= 0.68 && p < 0.8 ? 5.0 : 1.2;
    const noiseAmp = p > 0.22 && p < 0.36 ? 0.08 : p >= 0.68 && p < 0.8 ? 0.04 : 0.015;

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

      // Organic subtle breathing / turbulence
      const subtleWobble = Math.sin(time * noiseFreq + i * 0.1) * noiseAmp;

      // Mouse repulsion in Break & Constellation stages
      let mouseRepelX = 0;
      let mouseRepelY = 0;
      if (!isMobile && !hasTouch && p > 0.2 && p < 0.7) {
        const dx = targetX - pointer.x * 3.5;
        const dy = targetY - pointer.y * 2.5;
        const distSq = dx * dx + dy * dy;
        if (distSq < 1.2 && distSq > 0.001) {
          const force = (1.2 - distSq) * 0.25;
          mouseRepelX = (dx / Math.sqrt(distSq)) * force;
          mouseRepelY = (dy / Math.sqrt(distSq)) * force;
        }
      }

      // Dimension active spotlight pulse in constellation stage
      let dimensionGlow = 0;
      if (p >= 0.36 && p < 0.52 && activeDimension) {
        const clusterMap: Record<string, number> = {
          engineering: 1,
          ai: 2,
          systems: 3,
          creative: 4,
        };
        const activeCluster = clusterMap[activeDimension] || 0;
        if ((i % 5) === activeCluster) {
          dimensionGlow = Math.sin(time * 6 + i) * 0.08;
        }
      }

      // HENEOXY subsystem active spotlight pulse in OS stage
      let subsystemGlow = 0;
      if (p >= 0.8 && activeHeneoxySubsystem) {
        const subIndex = HENEOXY_SUBSYSTEMS.findIndex((s) => s.id === activeHeneoxySubsystem);
        if (subIndex !== -1 && (i % (HENEOXY_SUBSYSTEMS.length + 3)) === subIndex + 3) {
          subsystemGlow = Math.sin(time * 8 + i) * 0.12;
        }
      }

      posArr[idx3] = targetX + mouseRepelX + subtleWobble + (dimensionGlow > 0 ? dimensionGlow : 0);
      posArr[idx3 + 1] = targetY + mouseRepelY + subtleWobble + (subsystemGlow > 0 ? subsystemGlow : 0);
      posArr[idx3 + 2] = targetZ + (p >= 0.68 && p < 0.8 ? Math.cos(time * 8 + i) * 0.05 : 0);
    }

    positionsAttr.needsUpdate = true;

    // Update lines geometry endpoints to match connected particles
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

    // Rotate HENEOXY rings if in final stage
    if (ringsGroupRef.current && p > 0.78) {
      ringsGroupRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={masterGroupRef}>
      {/* 1. MASTER 1800-PARTICLE MORPHING BUFFER */}
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

      {/* 2. DYNAMIC RELATIONAL LINE SEGMENTS */}
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
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[1.98, 2.02, 64]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={progress > 0.78 ? (progress - 0.78) * 2.5 * 0.35 : 0}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
          <ringGeometry args={[2.68, 2.71, 64]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={progress > 0.78 ? (progress - 0.78) * 2.5 * 0.25 : 0}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

export default CinematicProofSequence3D;
