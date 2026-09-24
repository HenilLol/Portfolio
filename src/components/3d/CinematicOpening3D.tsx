import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useViewport } from '@/hooks/useViewport';
import { CinematicParticlePointsMaterial } from './shaders/particlePointsMaterial';

export interface CinematicOpening3DProps {
  progress: number; // 0.0 to 1.0 continuous normalized opening timeline
  pointerSensitivity?: number;
  /** Actual viewport pixel width for responsive letter spacing */
  viewportWidth?: number;
  /** Explicit fallback flag to force standard PointsMaterial (useful for testing or fallback profiles) */
  useFallbackShader?: boolean;
}

// Sample points along a 3D line segment with slight volumetric jitter
function sampleLine3D(
  p1: [number, number, number],
  p2: [number, number, number],
  count: number,
  jitter = 0.015
): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    points.push([
      p1[0] + (p2[0] - p1[0]) * t + (Math.random() - 0.5) * jitter,
      p1[1] + (p2[1] - p1[1]) * t + (Math.random() - 0.5) * jitter,
      p1[2] + (p2[2] - p1[2]) * t + (Math.random() - 0.5) * jitter,
    ]);
  }
  return points;
}

// Generate volumetric 3D letter strokes in local coordinates [-0.22, 0.22] x [-0.32, 0.32] x [-0.06, 0.06]
function generateLetterStrokes3D(char: string, totalPoints: number): [number, number, number][] {
  const w = 0.19;
  const h = 0.28;
  const d = 0.05;
  const segments: [[number, number, number], [number, number, number]][] = [];

  // Front & back face segments + cross-filaments for volumetric depth
  const addStroke = (x1: number, y1: number, x2: number, y2: number) => {
    segments.push([[x1, y1, -d], [x2, y2, -d]]);
    segments.push([[x1, y1, d], [x2, y2, d]]);
    segments.push([[x1, y1, -d], [x1, y1, d]]);
    segments.push([[x2, y2, -d], [x2, y2, d]]);
    // Diagonal cross-tie for density
    segments.push([[x1, y1, -d], [x2, y2, d]]);
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
      addStroke(-w * 0.6, -0.06, w * 0.6, -0.06);
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

// 4 Cardinal Dimensions configuration
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
const HENEOXY_ANGLES = [
  0,
  (Math.PI * 2 * 1) / 7,
  (Math.PI * 2 * 2) / 7,
  (Math.PI * 2 * 3) / 7,
  (Math.PI * 2 * 4) / 7,
  (Math.PI * 2 * 5) / 7,
  (Math.PI * 2 * 6) / 7,
];

export const CinematicOpening3D: React.FC<CinematicOpening3DProps> = ({
  progress,
  pointerSensitivity = 0.35,
  viewportWidth,
  useFallbackShader: propFallback = false,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const ringsGroupRef = useRef<THREE.Group>(null);
  const masterGroupRef = useRef<THREE.Group>(null);

  // Check URL query param ?fallback=true ONLY in development for deterministic audit and testing
  const isUrlFallback =
    Boolean(import.meta.env.DEV) &&
    typeof window !== 'undefined' &&
    window.location.search.includes('fallback=true');
  const useFallbackShader = propFallback || isUrlFallback;

  const [shaderFailed, setShaderFailed] = React.useState<boolean>(false);
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const reducedMotion = useReducedMotion();
  const { isMobile, hasTouch } = useViewport();
  const { camera, pointer, gl } = useThree();

  // Listen to Three.js WebGLRenderer shader compilation/link errors
  useEffect(() => {
    if (!gl || !gl.debug) return;
    const prevOnShaderError = gl.debug.onShaderError;

    // Self-chaining and recursion-safe shader error handler
    const shaderErrorHandler: NonNullable<THREE.WebGLRenderer['debug']['onShaderError']> = (
      glCtx,
      program,
      vShader,
      fShader
    ) => {
      console.warn('[CinematicOpening3D] WebGL shader compilation error detected by renderer. Activating fallback PointsMaterial.');
      if (typeof prevOnShaderError === 'function' && prevOnShaderError !== shaderErrorHandler) {
        prevOnShaderError(glCtx, program, vShader, fShader);
      }
      if (isMountedRef.current) {
        setShaderFailed((prev) => (prev ? prev : true));
      }
    };

    gl.debug.onShaderError = shaderErrorHandler;

    return () => {
      if (gl && gl.debug && gl.debug.onShaderError === shaderErrorHandler) {
        gl.debug.onShaderError = prevOnShaderError;
      }
    };
  }, [gl]);

  // 2400 particles desktop / 900 mobile for rich physical density
  const particleCount = useMemo(() => (isMobile ? 900 : 2400), [isMobile]);

  // Active particle material with lifecycle management & safe fallback
  const activeMaterial = useMemo(() => {
    if (shaderFailed || useFallbackShader) {
      return new THREE.PointsMaterial({
        size: isMobile ? 0.032 : 0.042,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
    }

    return new CinematicParticlePointsMaterial({
      size: isMobile ? 0.032 : 0.042,
      opacity: 0.92,
      coreSharpness: 16.0,
      coreLuminance: 0.45,
      auraIntensity: 0.65,
    });
  }, [isMobile, shaderFailed, useFallbackShader]);

  // Clean up GPU resources on unmount or when material changes (with double-disposal prevention)
  useEffect(() => {
    let isDisposed = false;
    return () => {
      if (!isDisposed) {
        isDisposed = true;
        activeMaterial.dispose();
      }
    };
  }, [activeMaterial]);

  // Expose diagnostic telemetry for verification audits (development only)
  useEffect(() => {
    if (Boolean(import.meta.env.DEV) && typeof window !== 'undefined') {
      (window as any).__CINEMATIC_3D__ = {
        gl,
        points: pointsRef.current,
        activeMaterial,
        shaderFailed,
        useFallbackShader,
      };
    }
    return () => {
      if (typeof window !== 'undefined' && (window as any).__CINEMATIC_3D__?.points === pointsRef.current) {
        delete (window as any).__CINEMATIC_3D__;
      }
    };
  }, [gl, activeMaterial, shaderFailed, useFallbackShader]);

  // Generate All Deterministic Target Buffers once
  const {
    posDormant,
    posField,
    posHenilConstruction,
    posPhysicalTypography,
    posBreak,
    posSpatialIdentity,
    posTechNetwork,
    posHeneoxyCore,
    posHeneoxyOS,
    colorsBase,
    lineIndices,
  } = useMemo(() => {
    const pDormant = new Float32Array(particleCount * 3);
    const pField = new Float32Array(particleCount * 3);
    const pHenilConstruction = new Float32Array(particleCount * 3);
    const pPhysicalTypography = new Float32Array(particleCount * 3);
    const pBreak = new Float32Array(particleCount * 3);
    const pSpatialIdentity = new Float32Array(particleCount * 3);
    const pTechNetwork = new Float32Array(particleCount * 3);
    const pHeneoxyCore = new Float32Array(particleCount * 3);
    const pHeneoxyOS = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Letter sampling setup: 10 letters (HENIL + PATEL)
    const letterPointsCount = Math.floor((particleCount * 0.7) / 10);
    const firstName = ['H', 'E', 'N', 'I', 'L'];
    const lastName = ['P', 'A', 'T', 'E', 'L'];
    // Responsive letter spacing: scale down progressively for narrower screens
    // vw=320 -> 0.32, vw=375 -> 0.36, vw=430 -> 0.40, vw=768+ -> 0.60
    const vw = viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1280);
    const letterSpacing = isMobile
      ? Math.max(0.30, Math.min(0.44, (vw / 768) * 0.60))
      : 0.60;

    // Responsive vertical centering:
    // Move particle formation upward so it sits in the visual middle of the viewport
    // (~45-50% on desktop, ~42-48% on mobile) with generous clearance from the lower editorial annotation text.
    const typographyCenterY = isMobile ? 0.36 : 0.62;

    let pIdx = 0;

    // Sample HENIL (Row 1)
    firstName.forEach((char, lIdx) => {
      const xOffset = (lIdx - 2) * letterSpacing;
      const yOffset = typographyCenterY + (isMobile ? 0.38 : 0.40);
      const strokes = generateLetterStrokes3D(char, letterPointsCount);
      strokes.forEach(([x, y, z]) => {
        if (pIdx < particleCount) {
          pPhysicalTypography[pIdx * 3] = xOffset + x;
          pPhysicalTypography[pIdx * 3 + 1] = yOffset + y;
          pPhysicalTypography[pIdx * 3 + 2] = z;

          // Progressive construction target: letter by letter emergence
          const letterT = lIdx / 5;
          pHenilConstruction[pIdx * 3] = xOffset + x * (0.3 + 0.7 * (1 - letterT));
          pHenilConstruction[pIdx * 3 + 1] = yOffset + y * (0.3 + 0.7 * (1 - letterT));
          pHenilConstruction[pIdx * 3 + 2] = z + (Math.random() - 0.5) * 0.3;

          pIdx++;
        }
      });
    });

    // Sample PATEL (Row 2)
    lastName.forEach((char, lIdx) => {
      const xOffset = (lIdx - 2) * letterSpacing;
      const yOffset = typographyCenterY - (isMobile ? 0.38 : 0.40);
      const strokes = generateLetterStrokes3D(char, letterPointsCount);
      strokes.forEach(([x, y, z]) => {
        if (pIdx < particleCount) {
          pPhysicalTypography[pIdx * 3] = xOffset + x;
          pPhysicalTypography[pIdx * 3 + 1] = yOffset + y;
          pPhysicalTypography[pIdx * 3 + 2] = z;

          // Progressive construction target
          const letterT = lIdx / 5;
          pHenilConstruction[pIdx * 3] = xOffset + x * (0.3 + 0.7 * (1 - letterT));
          pHenilConstruction[pIdx * 3 + 1] = yOffset + y * (0.3 + 0.7 * (1 - letterT));
          pHenilConstruction[pIdx * 3 + 2] = z + (Math.random() - 0.5) * 0.3;

          pIdx++;
        }
      });
    });

    // Remaining points are ambient coordinate filaments around the typography
    while (pIdx < particleCount) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.4 + Math.random() * 2.6;
      pPhysicalTypography[pIdx * 3] = Math.cos(angle) * r;
      pPhysicalTypography[pIdx * 3 + 1] = typographyCenterY + Math.sin(angle) * (r * 0.5);
      pPhysicalTypography[pIdx * 3 + 2] = -0.2 - Math.random() * 2.0;

      pHenilConstruction[pIdx * 3] = pPhysicalTypography[pIdx * 3];
      pHenilConstruction[pIdx * 3 + 1] = pPhysicalTypography[pIdx * 3 + 1];
      pHenilConstruction[pIdx * 3 + 2] = pPhysicalTypography[pIdx * 3 + 2];
      pIdx++;
    }

    // Populate all other deterministic stage targets
    for (let i = 0; i < particleCount; i++) {
      const idx3 = i * 3;

      // 1. DORMANT (Sparse deep cosmic dust cloud)
      const dTheta = Math.random() * Math.PI * 2;
      const dPhi = Math.acos(Math.random() * 2 - 1);
      const dRadius = 0.2 + Math.random() * 3.5;
      pDormant[idx3] = dRadius * Math.sin(dPhi) * Math.cos(dTheta);
      pDormant[idx3 + 1] = dRadius * Math.sin(dPhi) * Math.sin(dTheta);
      pDormant[idx3 + 2] = dRadius * Math.cos(dPhi);

      // 2. PARTICLE FIELD (Swirling toward center with depth)
      const fAngle = (i / particleCount) * Math.PI * 6;
      const fRadius = 0.4 + (i / particleCount) * 2.2;
      pField[idx3] = Math.cos(fAngle) * fRadius;
      pField[idx3 + 1] = Math.sin(fAngle) * (fRadius * 0.6);
      pField[idx3 + 2] = -0.5 + (Math.random() - 0.5) * 2.5;

      // 4. IDENTITY BREAK (Explosive 3D scattering fragments filling viewport)
      const bTheta = Math.random() * Math.PI * 2;
      const bPhi = Math.acos(Math.random() * 2 - 1);
      const bDist = 2.0 + Math.random() * 4.6;
      pBreak[idx3] = bDist * Math.sin(bPhi) * Math.cos(bTheta);
      pBreak[idx3 + 1] = bDist * Math.sin(bPhi) * Math.sin(bTheta);
      pBreak[idx3 + 2] = bDist * Math.cos(bPhi);

      // 5. SPATIAL IDENTITY (4 dimension clusters + central HENIL core)
      const clusterIdx = i % 5;
      const sTheta = Math.random() * Math.PI * 2;
      const sPhi = Math.acos(Math.random() * 2 - 1);
      const sRadius = 0.08 + Math.random() * 0.35;
      let center = [0, 0, 0];
      if (clusterIdx > 0) {
        center = DIMENSION_CLUSTERS[clusterIdx - 1].pos;
      }
      pSpatialIdentity[idx3] = center[0] + sRadius * Math.sin(sPhi) * Math.cos(sTheta);
      pSpatialIdentity[idx3 + 1] = center[1] + sRadius * Math.sin(sPhi) * Math.sin(sTheta);
      pSpatialIdentity[idx3 + 2] = center[2] + sRadius * Math.cos(sPhi);

      // 6. TECH NETWORK (16 computational hubs)
      const hub = TECH_NODES[i % TECH_NODES.length];
      const tAngle = Math.random() * Math.PI * 2;
      const tRadius = 0.05 + Math.random() * 0.28;
      pTechNetwork[idx3] = hub[0] + Math.cos(tAngle) * tRadius;
      pTechNetwork[idx3 + 1] = hub[1] + Math.sin(tAngle) * tRadius;
      pTechNetwork[idx3 + 2] = hub[2] + (Math.random() - 0.5) * 0.2;

      // 7. HENEOXY CORE (Singularity vortex collapse)
      const spiralAngle = (i / particleCount) * Math.PI * 12;
      const spiralRadius = 0.03 + (1 - i / particleCount) * 0.65;
      pHeneoxyCore[idx3] = Math.cos(spiralAngle) * spiralRadius;
      pHeneoxyCore[idx3 + 1] = Math.sin(spiralAngle) * spiralRadius;
      pHeneoxyCore[idx3 + 2] = (Math.random() - 0.5) * 0.12;

      // 8. HENEOXY OS (3 Concentric rings + 7 subsystem beacons)
      const subIdx = i % (HENEOXY_ANGLES.length + 3);
      if (subIdx < 3) {
        const ringR = subIdx === 0 ? 1.25 : subIdx === 1 ? 2.1 : 2.85;
        const ringA = Math.random() * Math.PI * 2;
        pHeneoxyOS[idx3] = Math.cos(ringA) * ringR;
        pHeneoxyOS[idx3 + 1] = Math.sin(ringA) * ringR;
        pHeneoxyOS[idx3 + 2] = (Math.random() - 0.5) * 0.1;
      } else {
        const baseAngle = HENEOXY_ANGLES[subIdx - 3];
        const beaconR = 2.1 + (Math.random() - 0.5) * 0.35;
        const angleOffset = (Math.random() - 0.5) * 0.22;
        pHeneoxyOS[idx3] = Math.cos(baseAngle + angleOffset) * beaconR;
        pHeneoxyOS[idx3 + 1] = Math.sin(baseAngle + angleOffset) * beaconR;
        pHeneoxyOS[idx3 + 2] = (Math.random() - 0.5) * 0.18;
      }

      // Base Colors: Gradient from Pure White to Electric Cyan, Sky Blue, and Indigo
      const dice = Math.random();
      if (dice > 0.6) {
        colors[idx3] = 0.0;
        colors[idx3 + 1] = 0.94; // Cyan #00F0FF
        colors[idx3 + 2] = 1.0;
      } else if (dice > 0.3) {
        colors[idx3] = 0.22;
        colors[idx3 + 1] = 0.74; // Sky Blue #38BDF8
        colors[idx3 + 2] = 0.97;
      } else {
        colors[idx3] = 0.96;
        colors[idx3 + 1] = 0.98; // White
        colors[idx3 + 2] = 1.0;
      }
    }

    // Dynamic line connection indices
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
      indices.push(t * 35, next * 35);
    }

    return {
      posDormant: pDormant,
      posField: pField,
      posHenilConstruction: pHenilConstruction,
      posPhysicalTypography: pPhysicalTypography,
      posBreak: pBreak,
      posSpatialIdentity: pSpatialIdentity,
      posTechNetwork: pTechNetwork,
      posHeneoxyCore: pHeneoxyCore,
      posHeneoxyOS: pHeneoxyOS,
      colorsBase: colors,
      lineIndices: new Uint16Array(indices),
    };
  }, [particleCount, isMobile, viewportWidth]);

  // Current typed array buffers for points and lines
  const currentPositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const linePositions = useMemo(() => new Float32Array(lineIndices.length * 3), [lineIndices.length]);

  // Camera trajectory parameters driven continuously by opening progress
  const cameraTarget = useMemo(() => {
    const p = Math.max(0, Math.min(1, progress));

    // 0.00 – 0.08: DORMANT
    if (p < 0.08) {
      return {
        pos: [0, 0, 8.5] as [number, number, number],
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.05,
        pointSize: isMobile ? 0.026 : 0.034,
      };
    }
    // 0.08 – 0.20: PARTICLE FIELD
    if (p < 0.20) {
      const s = (p - 0.08) / 0.12;
      return {
        pos: [0, 0, 8.5 - s * 1.7] as [number, number, number], // 8.5 -> 6.8
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.10 + s * 0.10,
        pointSize: isMobile ? 0.028 : 0.036,
      };
    }
    // 0.20 – 0.42: HENIL CONSTRUCTION
    if (p < 0.42) {
      const s = (p - 0.20) / 0.22;
      return {
        pos: [0, 0, 6.8 - s * 2.0] as [number, number, number], // 6.8 -> 4.8
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.20 + s * 0.15,
        pointSize: isMobile ? 0.030 : 0.040,
      };
    }
    // 0.42 – 0.55: PHYSICAL HENIL PATEL
    if (p < 0.55) {
      const s = (p - 0.42) / 0.13;
      return {
        pos: [0.3 * s, 0.1 * s, 4.8 - s * 0.3] as [number, number, number], // 4.8 -> 4.5
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.35,
        pointSize: isMobile ? 0.032 : 0.042,
      };
    }
    // 0.55 – 0.68: IDENTITY BREAK
    if (p < 0.68) {
      const s = (p - 0.55) / 0.13;
      return {
        pos: [0.3 * (1 - s), -0.2 * s, 4.5 + s * 1.3] as [number, number, number], // Pull back to 5.8
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.35 * (1 - s),
        pointSize: isMobile ? 0.026 : 0.034,
      };
    }
    // 0.68 – 0.78: SPATIAL IDENTITY
    if (p < 0.78) {
      const s = (p - 0.68) / 0.10;
      return {
        pos: [-0.9 * s, 0.4 * s, 5.8 - s * 1.0] as [number, number, number], // Wide orbit at 4.8
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.75,
        pointSize: isMobile ? 0.030 : 0.040,
      };
    }
    // 0.78 – 0.88: TECHNOLOGY NETWORK
    if (p < 0.88) {
      const s = (p - 0.78) / 0.10;
      return {
        pos: [-0.9 * (1 - s), -0.4 * s, 4.8 + s * 0.4] as [number, number, number], // 5.2
        lookAt: [0, 0, 0] as [number, number, number],
        lineOpacity: 0.85,
        pointSize: isMobile ? 0.028 : 0.038,
      };
    }
    // 0.88 – 1.00: HENEOXY EMERGENCE & PORTFOLIO HANDOVER
    const s = (p - 0.88) / 0.12;
    return {
      pos: [0.6 * s, -0.2 * s, 5.2 - s * 1.2] as [number, number, number], // Forward dive to 4.0
      lookAt: [0, 0, 0] as [number, number, number],
      lineOpacity: 0.70,
      pointSize: isMobile ? 0.032 : 0.042,
    };
  }, [progress, isMobile]);

  // Frame tick: continuous deterministic matter kinematics
  useFrame((state, delta) => {
    if (!pointsRef.current || !masterGroupRef.current) return;

    const p = Math.max(0, Math.min(1, progress));
    const time = state.clock.getElapsedTime();
    const lerpSpeed = Math.min(delta * 4.2, 0.18);

    // Synchronize particle point size with camera trajectory (1.18x adjustment for circular area equivalence if custom shader active)
    if (activeMaterial) {
      const sizeMultiplier = (shaderFailed || useFallbackShader) ? 1.0 : 1.18;
      activeMaterial.size = cameraTarget.pointSize * sizeMultiplier;
    }

    // Smooth camera translation
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

    // Determine fromTarget and toTarget based on openingProgress
    let fromTarget = posDormant;
    let toTarget = posField;
    let stageT = 0;

    if (p < 0.08) {
      fromTarget = posDormant;
      toTarget = posField;
      stageT = 0;
    } else if (p < 0.20) {
      fromTarget = posDormant;
      toTarget = posField;
      stageT = (p - 0.08) / 0.12;
    } else if (p < 0.42) {
      fromTarget = posField;
      toTarget = posHenilConstruction;
      stageT = (p - 0.20) / 0.22;
    } else if (p < 0.55) {
      fromTarget = posHenilConstruction;
      toTarget = posPhysicalTypography;
      stageT = (p - 0.42) / 0.13;
    } else if (p < 0.68) {
      fromTarget = posPhysicalTypography;
      toTarget = posBreak;
      stageT = (p - 0.55) / 0.13;
    } else if (p < 0.78) {
      fromTarget = posBreak;
      toTarget = posSpatialIdentity;
      stageT = (p - 0.68) / 0.10;
    } else if (p < 0.88) {
      fromTarget = posSpatialIdentity;
      toTarget = posTechNetwork;
      stageT = (p - 0.78) / 0.10;
    } else if (p < 0.93) {
      fromTarget = posTechNetwork;
      toTarget = posHeneoxyCore;
      stageT = (p - 0.88) / 0.05;
    } else {
      fromTarget = posHeneoxyCore;
      toTarget = posHeneoxyOS;
      stageT = (p - 0.93) / 0.07;
    }

    // Hermite smoothstep curve
    const smoothT = stageT * stageT * (3 - 2 * stageT);

    const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArr = positionsAttr.array as Float32Array;

    const noiseFreq = p >= 0.55 && p < 0.68 ? 4.0 : p >= 0.92 && p < 0.96 ? 6.0 : 1.2;
    const noiseAmp = p >= 0.55 && p < 0.68 ? 0.08 : p >= 0.92 && p < 0.96 ? 0.04 : 0.015;

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

      // Cursor spring repulsion in physical typography & break stages
      let mouseRepelX = 0;
      let mouseRepelY = 0;
      let mouseRepelZ = 0;
      if (!isMobile && !hasTouch && p > 0.15 && p < 0.75) {
        const dx = targetX - pointer.x * 3.5;
        const dy = targetY - pointer.y * 2.5;
        const distSq = dx * dx + dy * dy;
        const maxDist = p >= 0.42 && p <= 0.55 ? 1.2 : 0.9;
        if (distSq < maxDist && distSq > 0.001) {
          const force = (maxDist - distSq) * (p >= 0.42 && p <= 0.55 ? 0.28 : 0.18);
          const dist = Math.sqrt(distSq);
          mouseRepelX = (dx / dist) * force;
          mouseRepelY = (dy / dist) * force;
          mouseRepelZ = (1.0 - dist / maxDist) * 0.15;
        }
      }

      posArr[idx3] = targetX + mouseRepelX + subtleWobble;
      posArr[idx3 + 1] = targetY + mouseRepelY + subtleWobble;
      posArr[idx3 + 2] = targetZ + mouseRepelZ + (p >= 0.92 && p < 0.96 ? Math.cos(time * 8 + i) * 0.04 : 0);
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

    // Rotate HENEOXY OS rings in final scene
    if (ringsGroupRef.current && p > 0.88) {
      ringsGroupRef.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <group ref={masterGroupRef}>
      {/* 1. MASTER 2,400-PARTICLE CONTINUOUS PHYSICAL MATTER */}
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
        <primitive object={activeMaterial} attach="material" />
      </points>

      {/* 2. DYNAMIC CONNECTING LINE SKELETON */}
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
          <ringGeometry args={[2.08, 2.12, 64]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={progress > 0.88 ? Math.min(0.45, (progress - 0.88) * 8.33 * 0.45) : 0}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 3.2, Math.PI / 6, 0]}>
          <ringGeometry args={[2.82, 2.86, 64]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={progress > 0.88 ? Math.min(0.35, (progress - 0.88) * 8.33 * 0.35) : 0}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

export default CinematicOpening3D;
