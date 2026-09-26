import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
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

interface StrokeDefinition {
  type: 'line' | 'arc' | 'bezier';
  length: number;
  sample: (t: number) => [number, number];
}

// 2D Line stroke definition with exact length calculation
function createLineStroke(x1: number, y1: number, x2: number, y2: number): StrokeDefinition {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return {
    type: 'line',
    length: len,
    sample: (t: number) => [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t],
  };
}

// 2D Elliptical Arc stroke definition with smooth angular interpolation
function createArcStroke(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  thetaStart: number,
  thetaEnd: number
): StrokeDefinition {
  const len = ((rx + ry) / 2) * Math.abs(thetaEnd - thetaStart);
  return {
    type: 'arc',
    length: len,
    sample: (t: number) => {
      const theta = thetaStart + (thetaEnd - thetaStart) * t;
      return [cx + rx * Math.cos(theta), cy + ry * Math.sin(theta)];
    },
  };
}

// 2D Cubic Bezier curve stroke definition with true arc-length reparameterization
function createCubicBezierStroke(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  subdivisions: number = 32
): StrokeDefinition {
  const table: number[] = [0];
  let prev = p0;
  let totalLen = 0;
  for (let i = 1; i <= subdivisions; i++) {
    const t = i / subdivisions;
    const it = 1 - t;
    const cur: [number, number] = [
      it * it * it * p0[0] + 3 * it * it * t * p1[0] + 3 * it * t * t * p2[0] + t * t * t * p3[0],
      it * it * it * p0[1] + 3 * it * it * t * p1[1] + 3 * it * t * t * p2[1] + t * t * t * p3[1],
    ];
    totalLen += Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
    table.push(totalLen);
    prev = cur;
  }
  return {
    type: 'bezier',
    length: totalLen,
    sample: (u: number) => {
      const clampedU = Math.max(0, Math.min(1, u));
      const targetLen = clampedU * totalLen;
      let low = 0;
      let high = subdivisions;
      while (low < high) {
        const mid = (low + high) >> 1;
        if (table[mid] < targetLen) low = mid + 1;
        else high = mid;
      }
      const idx = Math.max(1, low);
      const segLen = table[idx] - table[idx - 1];
      const frac = segLen > 0.000001 ? (targetLen - table[idx - 1]) / segLen : 0;
      const t = (idx - 1 + frac) / subdivisions;
      const it = 1 - t;
      return [
        it * it * it * p0[0] + 3 * it * it * t * p1[0] + 3 * it * t * t * p2[0] + t * t * t * p3[0],
        it * it * it * p0[1] + 3 * it * it * t * p1[1] + 3 * it * t * t * p2[1] + t * t * t * p3[1],
      ];
    },
  };
}

// 2D Quadratic Bezier curve stroke definition with true arc-length reparameterization
function createQuadraticBezierStroke(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  subdivisions: number = 24
): StrokeDefinition {
  const table: number[] = [0];
  let prev = p0;
  let totalLen = 0;
  for (let i = 1; i <= subdivisions; i++) {
    const t = i / subdivisions;
    const it = 1 - t;
    const cur: [number, number] = [
      it * it * p0[0] + 2 * it * t * p1[0] + t * t * p2[0],
      it * it * p0[1] + 2 * it * t * p1[1] + t * t * p2[1],
    ];
    totalLen += Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
    table.push(totalLen);
    prev = cur;
  }
  return {
    type: 'bezier',
    length: totalLen,
    sample: (u: number) => {
      const clampedU = Math.max(0, Math.min(1, u));
      const targetLen = clampedU * totalLen;
      let low = 0;
      let high = subdivisions;
      while (low < high) {
        const mid = (low + high) >> 1;
        if (table[mid] < targetLen) low = mid + 1;
        else high = mid;
      }
      const idx = Math.max(1, low);
      const segLen = table[idx] - table[idx - 1];
      const frac = segLen > 0.000001 ? (targetLen - table[idx - 1]) / segLen : 0;
      const t = (idx - 1 + frac) / subdivisions;
      const it = 1 - t;
      return [
        it * it * p0[0] + 2 * it * t * p1[0] + t * t * p2[0],
        it * it * p0[1] + 2 * it * t * p1[1] + t * t * p2[1],
      ];
    },
  };
}

// Architectural glyph stroke topologies for full alphabet
function getLetterStrokes(char: string, w: number, h: number): StrokeDefinition[] {
  switch (char.toUpperCase()) {
    case 'H':
      return [
        createLineStroke(-w, -h, -w, h),
        createLineStroke(w, -h, w, h),
        createLineStroke(-w, 0, w, 0),
      ];
    case 'E':
      return [
        createLineStroke(-w, -h, -w, h),
        createLineStroke(-w, h, w, h),
        createLineStroke(-w, 0.02, w * 0.80, 0.02),
        createLineStroke(-w, -h, w, -h),
      ];
    case 'N':
      return [
        createLineStroke(-w, -h, -w, h),
        createLineStroke(-w, h, w, -h),
        createLineStroke(w, -h, w, h),
      ];
    case 'I':
      // Narrow glyph with balanced top/bottom serifs
      return [
        createLineStroke(0, -h, 0, h),
        createLineStroke(-0.09, h, 0.09, h),
        createLineStroke(-0.09, -h, 0.09, -h),
      ];
    case 'L':
      return [
        createLineStroke(-w, -h, -w, h),
        createLineStroke(-w, -h, w, -h),
      ];
    case 'P':
      return [
        // Left vertical structural spine
        createLineStroke(-w, -h, -w, h),
        // Continuous smooth architectural cubic Bezier curved bowl from top spine to mid spine
        createCubicBezierStroke(
          [-w, h],
          [w * 1.35, h],
          [w * 1.35, 0.02],
          [-w, 0.02]
        ),
      ];
    case 'A':
      return [
        createLineStroke(-w, -h, 0, h),
        createLineStroke(0, h, w, -h),
        createLineStroke(-w * 0.55, -0.06, w * 0.55, -0.06),
      ];
    case 'T':
      return [
        createLineStroke(-w * 1.1, h, w * 1.1, h),
        createLineStroke(0, -h, 0, h),
      ];
    case 'C':
      return [
        createArcStroke(0, 0, w, h, Math.PI * 0.75, -Math.PI * 0.75),
      ];
    case 'D':
      return [
        createLineStroke(-w, -h, -w, h),
        createArcStroke(-w, 0, 2 * w, h, Math.PI / 2, -Math.PI / 2),
      ];
    case 'O':
      return [
        createArcStroke(0, 0, w, h, 0, Math.PI * 2),
      ];
    case 'R':
      return [
        createLineStroke(-w, -h, -w, h),
        createCubicBezierStroke([-w, h], [w * 1.35, h], [w * 1.35, 0.02], [-w, 0.02]),
        createLineStroke(-w * 0.15, 0.02, w, -h),
      ];
    case 'S':
      return [
        createQuadraticBezierStroke([w * 0.9, h * 0.8], [-w * 0.9, h * 0.9], [0, 0.02]),
        createQuadraticBezierStroke([0, 0.02], [w * 0.9, -h * 0.9], [-w * 0.9, -h * 0.8]),
      ];
    default:
      return [createLineStroke(0, -h, 0, h)];
  }
}

export interface SpatialNodeConfig {
  id: string;
  name: string;
  pos: [number, number, number];
  r: number;
  color: string;
}

// 5 Spatial Identity Constellation Nodes (Center + 4 Cardinal Anchors)
const SPATIAL_CONSTELLATION_NODES: SpatialNodeConfig[] = [
  { id: 'center', name: 'SPATIAL IDENTITY', pos: [0.0, 0.0, 0.0], r: 0.88, color: '#00F0FF' },
  { id: 'engineering', name: 'ENGINEERING', pos: [-2.25, 1.25, 0.0], r: 0.66, color: '#00F0FF' },
  { id: 'ai', name: 'AI & COGNITION', pos: [2.25, 1.25, 0.0], r: 0.66, color: '#38BDF8' },
  { id: 'creative', name: 'CREATIVE', pos: [-2.25, -1.25, 0.0], r: 0.66, color: '#EC4899' },
  { id: 'systems', name: 'SYSTEMS', pos: [2.25, -1.25, 0.0], r: 0.66, color: '#818CF8' },
];

const SPATIAL_CONSTELLATION_NODES_MOBILE: SpatialNodeConfig[] = [
  { id: 'center', name: 'SPATIAL IDENTITY', pos: [0.0, 0.0, 0.0], r: 0.46, color: '#00F0FF' },
  { id: 'engineering', name: 'ENGINEERING', pos: [-0.62, 1.45, 0.0], r: 0.34, color: '#00F0FF' },
  { id: 'ai', name: 'AI & COGNITION', pos: [0.62, 1.45, 0.0], r: 0.34, color: '#38BDF8' },
  { id: 'creative', name: 'CREATIVE', pos: [-0.62, -1.45, 0.0], r: 0.34, color: '#EC4899' },
  { id: 'systems', name: 'SYSTEMS', pos: [0.62, -1.45, 0.0], r: 0.34, color: '#818CF8' },
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
  const totalTypographyPoints = useMemo(() => (isMobile ? 760 : 2000), [isMobile]);

  // Active particle material with lifecycle management & safe fallback
  const activeMaterial = useMemo(() => {
    if (shaderFailed || useFallbackShader) {
      return new THREE.PointsMaterial({
        size: isMobile ? 0.036 : 0.046,
        vertexColors: true,
        transparent: true,
        opacity: 0.96,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
    }

    return new CinematicParticlePointsMaterial({
      size: isMobile ? 0.036 : 0.046,
      opacity: 0.96,
      coreSharpness: 14.0,
      coreLuminance: 0.55,
      auraIntensity: 0.75,
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

  // Responsive Spatial Identity Constellation Nodes (Center + 4 Cardinal Anchors)
  const spatialNodes = useMemo<SpatialNodeConfig[]>(() => {
    return isMobile ? SPATIAL_CONSTELLATION_NODES_MOBILE : SPATIAL_CONSTELLATION_NODES;
  }, [isMobile]);

  // Constellation connecting backbone lines running between node perimeters at z = -0.10
  const spatialLinePositions = useMemo(() => {
    const pairs = [
      [0, 1], // Center -> Engineering
      [0, 2], // Center -> AI & Cognition
      [0, 3], // Center -> Creative
      [0, 4], // Center -> Systems
      [1, 2], // Engineering -> AI & Cognition
      [2, 4], // AI & Cognition -> Systems
      [4, 3], // Systems -> Creative
      [3, 1], // Creative -> Engineering
    ];
    const pos = new Float32Array(pairs.length * 2 * 3);
    pairs.forEach(([iA, iB], idx) => {
      const nA = spatialNodes[iA];
      const nB = spatialNodes[iB];
      const dx = nB.pos[0] - nA.pos[0];
      const dy = nB.pos[1] - nA.pos[1];
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      // Perimeter anchors so lines never enter circle interiors or cross text
      const sx = nA.pos[0] + ux * nA.r;
      const sy = nA.pos[1] + uy * nA.r;
      const ex = nB.pos[0] - ux * nB.r;
      const ey = nB.pos[1] - uy * nB.r;
      const z = -0.10;

      const pIdx = idx * 6;
      pos[pIdx] = sx;
      pos[pIdx + 1] = sy;
      pos[pIdx + 2] = z;
      pos[pIdx + 3] = ex;
      pos[pIdx + 4] = ey;
      pos[pIdx + 5] = z;
    });
    return pos;
  }, [spatialNodes]);

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

    const vw = viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1280);
    const scale = isMobile ? Math.max(0.62, Math.min(0.85, (vw / 768) * 0.95)) : 1.0;
    const rowOffset = (isMobile ? 0.36 : 0.38) * scale;
    const typographyCenterY = 0.0;

    const w = 0.17;
    const h = 0.28;

    // 10 Glyphs layout with balanced optical kerning
    const glyphLayout = [
      // Row 1: HENIL
      { char: 'H', gx: -1.00 * scale, gy: typographyCenterY + rowOffset, isI: false },
      { char: 'E', gx: -0.50 * scale, gy: typographyCenterY + rowOffset, isI: false },
      { char: 'N', gx: 0.00 * scale, gy: typographyCenterY + rowOffset, isI: false },
      { char: 'I', gx: 0.50 * scale, gy: typographyCenterY + rowOffset, isI: true },
      { char: 'L', gx: 1.00 * scale, gy: typographyCenterY + rowOffset, isI: false },
      // Row 2: PATEL
      { char: 'P', gx: -1.06 * scale, gy: typographyCenterY - rowOffset, isI: false },
      { char: 'A', gx: -0.53 * scale, gy: typographyCenterY - rowOffset, isI: false },
      { char: 'T', gx: 0.00 * scale, gy: typographyCenterY - rowOffset, isI: false },
      { char: 'E', gx: 0.53 * scale, gy: typographyCenterY - rowOffset, isI: false },
      { char: 'L', gx: 1.06 * scale, gy: typographyCenterY - rowOffset, isI: false },
    ];

    interface FlatStroke {
      gIdx: number;
      char: string;
      gx: number;
      gy: number;
      stroke: StrokeDefinition;
      length: number;
    }

    const flatStrokes: FlatStroke[] = [];
    glyphLayout.forEach((g, gIdx) => {
      const cw = g.isI ? 0.09 : w;
      const strokes = getLetterStrokes(g.char, cw, h);
      strokes.forEach((s) => {
        flatStrokes.push({
          gIdx,
          char: g.char,
          gx: g.gx,
          gy: g.gy,
          stroke: s,
          length: s.length,
        });
      });
    });

    const totalArcLength = flatStrokes.reduce((sum, s) => sum + s.length, 0);

    // Global arc-length-weighted allocation with guaranteed minimum 6 points per stroke
    const allocations = flatStrokes.map((s) =>
      Math.max(6, Math.round((s.length / totalArcLength) * totalTypographyPoints))
    );

    // Reconcile total typography points deterministically
    let currentSum = allocations.reduce((a, b) => a + b, 0);
    let diff = totalTypographyPoints - currentSum;
    let allocIdx = 0;
    while (diff !== 0) {
      if (diff > 0) {
        allocations[allocIdx % allocations.length]++;
        diff--;
      } else {
        if (allocations[allocIdx % allocations.length] > 6) {
          allocations[allocIdx % allocations.length]--;
          diff++;
        }
      }
      allocIdx++;
    }

    let pIdx = 0;

    // Sample all typography strokes uniformly along arc length
    flatStrokes.forEach((item, flatIdx) => {
      const count = allocations[flatIdx];
      for (let i = 0; i < count; i++) {
        if (pIdx >= particleCount) break;

        const u = count === 1 ? 0.5 : i / (count - 1);
        const [lx, ly] = item.stroke.sample(u);

        // Planar precision coordinates with microscopic physical jitter
        const xFinal = item.gx + lx * scale + (Math.random() - 0.5) * 0.002;
        const yFinal = item.gy + ly * scale + (Math.random() - 0.5) * 0.002;
        const zFinal = (Math.random() - 0.5) * 0.012;

        pPhysicalTypography[pIdx * 3] = xFinal;
        pPhysicalTypography[pIdx * 3 + 1] = yFinal;
        pPhysicalTypography[pIdx * 3 + 2] = zFinal;

        // Symmetrical orbital construction target
        const angle = item.gIdx * 1.25 + (pIdx % 16) * (Math.PI / 8);
        const spiralR = 0.28 + (pIdx % 5) * 0.05;
        pHenilConstruction[pIdx * 3] = xFinal + Math.cos(angle) * spiralR;
        pHenilConstruction[pIdx * 3 + 1] = yFinal + Math.sin(angle) * spiralR;
        pHenilConstruction[pIdx * 3 + 2] = zFinal + Math.sin(angle * 2) * 0.04;

        pIdx++;
      }
    });

    const letterTotalPointsCalculated = pIdx;

    // Dedicated Foreground Particle Layer: Luminous stardust passing directly in front of the typography (z in [0.50, 1.38])
    const foregroundCount = isMobile ? 14 : 36;
    const foregroundEnd = letterTotalPointsCalculated + foregroundCount;

    for (let fgIdx = 0; fgIdx < foregroundCount && pIdx < particleCount; fgIdx++) {
      const u = (fgIdx + 0.5) / foregroundCount;
      const xFg = (-1.20 + u * 2.40) * scale;
      const yBase = fgIdx % 2 === 0 ? typographyCenterY + rowOffset : typographyCenterY - rowOffset;
      const yFg = yBase + Math.sin(fgIdx * 1.7) * (0.16 * scale);
      const zFg = 0.50 + ((fgIdx % 5) * 0.22); // Explicit foreground depth between camera (z=4.7) and text (z=0)

      pPhysicalTypography[pIdx * 3] = xFg;
      pPhysicalTypography[pIdx * 3 + 1] = yFg;
      pPhysicalTypography[pIdx * 3 + 2] = zFg;

      // Symmetrical orbital approach
      const angle = fgIdx * 0.85 + (pIdx % 8) * (Math.PI / 4);
      const spiralR = 0.35 + (pIdx % 4) * 0.08;
      pHenilConstruction[pIdx * 3] = xFg + Math.cos(angle) * spiralR;
      pHenilConstruction[pIdx * 3 + 1] = yFg + Math.sin(angle) * spiralR;
      pHenilConstruction[pIdx * 3 + 2] = zFg + Math.sin(angle * 2) * 0.06;

      pIdx++;
    }

    // Remaining points are ambient background coordinate filaments in outer exclusion zone (r >= 2.2, z <= -0.8)
    while (pIdx < particleCount) {
      const angle = Math.random() * Math.PI * 2;
      const r = 2.2 + Math.random() * 2.8;
      const zAmb = -0.8 - Math.random() * 2.8;
      pPhysicalTypography[pIdx * 3] = Math.cos(angle) * r;
      pPhysicalTypography[pIdx * 3 + 1] = typographyCenterY + Math.sin(angle) * (r * 0.55);
      pPhysicalTypography[pIdx * 3 + 2] = zAmb;

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

      // 5. SPATIAL IDENTITY: 5 distinct circular particle nodes with strict text exclusion zone
      const nodeIdx = i % 5;
      const node = spatialNodes[nodeIdx];
      const nodeParticleIdx = Math.floor(i / 5);
      const totalInNode = Math.floor(particleCount / 5);

      // Deterministic uniform angle distribution around circle perimeter
      const circleAngle = (nodeParticleIdx / totalInNode) * Math.PI * 2 + ((i * 17) % 11) * 0.015;

      // Controlled halo ring: r in [0.94 * R, 1.12 * R] (strictly outside text exclusion zone 0.90 * R)
      const rJitter = (((i * 37) % 100) / 100 - 0.5) * 0.14;
      const finalR = node.r * (1.0 + rJitter);

      // Planar depth: z in [-0.03, 0.03] (strictly behind text)
      const zJitter = (((i * 53) % 100) / 100 - 0.5) * 0.05;

      pSpatialIdentity[idx3] = node.pos[0] + Math.cos(circleAngle) * finalR;
      pSpatialIdentity[idx3 + 1] = node.pos[1] + Math.sin(circleAngle) * finalR;
      pSpatialIdentity[idx3 + 2] = node.pos[2] + zJitter;

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

      // Luminous hierarchy: Typography vs Foreground Stardust vs Ambient Background
      if (i < letterTotalPointsCalculated) {
        // Typography particles (Brilliant Diamond White & Electric Cyan)
        const dice = Math.random();
        if (dice > 0.30) {
          colors[idx3] = 1.0;
          colors[idx3 + 1] = 1.0;
          colors[idx3 + 2] = 1.0;
        } else if (dice > 0.10) {
          colors[idx3] = 0.15;
          colors[idx3 + 1] = 0.95;
          colors[idx3 + 2] = 1.0;
        } else {
          colors[idx3] = 0.35;
          colors[idx3 + 1] = 0.85;
          colors[idx3 + 2] = 1.0;
        }
      } else if (i < foregroundEnd) {
        // Foreground stardust crossing over letters (Luminous crystalline diamond-cyan)
        const dice = Math.random();
        if (dice > 0.40) {
          colors[idx3] = 0.85;
          colors[idx3 + 1] = 0.98;
          colors[idx3 + 2] = 1.0;
        } else {
          colors[idx3] = 0.20;
          colors[idx3 + 1] = 0.95;
          colors[idx3 + 2] = 1.0;
        }
      } else {
        // Ambient background particles: deep subtle ethereal palette
        const dice = Math.random();
        if (dice > 0.5) {
          colors[idx3] = 0.15;
          colors[idx3 + 1] = 0.35;
          colors[idx3 + 2] = 0.75;
        } else {
          colors[idx3] = 0.05;
          colors[idx3 + 1] = 0.45;
          colors[idx3 + 2] = 0.65;
        }
      }
    }

    // Dynamic line connection indices: connect strictly among ambient background nodes
    const indices: number[] = [];
    const ambientStart = foregroundEnd;
    const ambientCount = Math.max(1, particleCount - ambientStart);
    for (let t = 0; t < TECH_NODES.length; t++) {
      const next = (t + 1) % TECH_NODES.length;
      const p1 = ambientStart + ((t * 19) % ambientCount);
      const p2 = ambientStart + ((next * 19) % ambientCount);
      indices.push(p1, p2);
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
      letterTotalPointsCalculated,
      foregroundCount,
    };
  }, [particleCount, isMobile, viewportWidth, totalTypographyPoints, spatialNodes]);

  // Current typed array buffers for points and lines
  const currentPositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const linePositions = useMemo(() => new Float32Array(lineIndices.length * 3), [lineIndices.length]);

  // Smooth quintic interpolation (C1 & C2 smoothstep with zero 1st and 2nd derivatives at endpoints)
  const quinticSmoothstep = (t: number): number => {
    const ct = Math.max(0, Math.min(1, t));
    return ct * ct * ct * (ct * (ct * 6 - 15) + 10);
  };

  // Camera trajectory waypoints driven continuously by opening progress
  const cameraTarget = useMemo(() => {
    const p = Math.max(0, Math.min(1, progress));
    const ptSize = (desk: number, mob: number) => (isMobile ? mob : desk);

    interface Waypoint {
      p: number;
      pos: [number, number, number];
      lookAt: [number, number, number];
      lineOpacity: number;
      pointSize: number;
    }

    // Continuous C1/C2 waypoints with matching endpoint coordinates across all stage boundaries
    const WAYPOINTS: Waypoint[] = [
      { p: 0.00, pos: [0, 0, 8.5], lookAt: [0, 0, 0], lineOpacity: 0.0, pointSize: ptSize(0.034, 0.026) },
      { p: 0.06, pos: [0, 0, 8.5], lookAt: [0, 0, 0], lineOpacity: 0.0, pointSize: ptSize(0.034, 0.026) },
      { p: 0.20, pos: [0, 0, 6.8], lookAt: [0, 0, 0], lineOpacity: 0.0, pointSize: ptSize(0.038, 0.028) },
      { p: 0.42, pos: [0, 0, 4.8], lookAt: [0, 0, 0], lineOpacity: 0.0, pointSize: ptSize(0.046, 0.036) },
      { p: 0.54, pos: [0.10, 0.04, 4.65], lookAt: [0, 0, 0], lineOpacity: 0.0, pointSize: ptSize(0.046, 0.036) },
      { p: 0.68, pos: [0, 0, 5.8], lookAt: [0, 0, 0], lineOpacity: 0.35, pointSize: ptSize(0.038, 0.030) },
      { p: 0.80, pos: [0, 0, 5.6], lookAt: [0, 0, 0], lineOpacity: 0.70, pointSize: ptSize(0.042, 0.032) },
      { p: 0.90, pos: [0.35, -0.15, 5.1], lookAt: [0, 0, 0], lineOpacity: 0.85, pointSize: ptSize(0.042, 0.032) },
      { p: 1.00, pos: [0.50, -0.10, 4.3], lookAt: [0, 0, 0], lineOpacity: 0.50, pointSize: ptSize(0.044, 0.034) },
    ];

    let i = 0;
    while (i < WAYPOINTS.length - 1 && p > WAYPOINTS[i + 1].p) {
      i++;
    }

    if (i >= WAYPOINTS.length - 1) {
      return WAYPOINTS[WAYPOINTS.length - 1];
    }

    const wA = WAYPOINTS[i];
    const wB = WAYPOINTS[i + 1];
    const range = wB.p - wA.p;
    const t = range === 0 ? 0 : (p - wA.p) / range;
    const st = quinticSmoothstep(t);

    const lerp = (a: number, b: number) => a + (b - a) * st;

    return {
      pos: [
        lerp(wA.pos[0], wB.pos[0]),
        lerp(wA.pos[1], wB.pos[1]),
        lerp(wA.pos[2], wB.pos[2]),
      ] as [number, number, number],
      lookAt: [
        lerp(wA.lookAt[0], wB.lookAt[0]),
        lerp(wA.lookAt[1], wB.lookAt[1]),
        lerp(wA.lookAt[2], wB.lookAt[2]),
      ] as [number, number, number],
      lineOpacity: lerp(wA.lineOpacity, wB.lineOpacity),
      pointSize: lerp(wA.pointSize, wB.pointSize),
    };
  }, [progress, isMobile]);

  // Total letter points for selective typography stabilization
  const letterTotalPoints = totalTypographyPoints;
  const foregroundCount = isMobile ? 14 : 36;

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

    // Determine fromTarget, toTarget, and stageT based on normalized progress
    let fromTarget = posDormant;
    let toTarget = posField;
    let stageT = 0;
    let stageId = 'DORMANT';

    if (p < 0.06) {
      fromTarget = posDormant;
      toTarget = posField;
      stageT = 0;
      stageId = 'DORMANT';
    } else if (p < 0.20) {
      fromTarget = posDormant;
      toTarget = posField;
      stageT = (p - 0.06) / 0.14;
      stageId = 'FIELD';
    } else if (p < 0.31) {
      fromTarget = posField;
      toTarget = posHenilConstruction;
      stageT = (p - 0.20) / 0.11;
      stageId = 'CONSTRUCTION_1';
    } else if (p < 0.42) {
      fromTarget = posHenilConstruction;
      toTarget = posPhysicalTypography;
      stageT = (p - 0.31) / 0.11;
      stageId = 'CONSTRUCTION_2';
    } else if (p < 0.54) {
      // 0.42 - 0.54: Physical Formation Hold (spatially static and fully formed)
      fromTarget = posPhysicalTypography;
      toTarget = posPhysicalTypography;
      stageT = 0;
      stageId = 'HOLD';
    } else if (p < 0.68) {
      fromTarget = posPhysicalTypography;
      toTarget = posBreak;
      stageT = (p - 0.54) / 0.14;
      stageId = 'BREAK';
    } else if (p < 0.80) {
      fromTarget = posBreak;
      toTarget = posSpatialIdentity;
      stageT = (p - 0.68) / 0.12;
      stageId = 'SPATIAL';
    } else if (p < 0.90) {
      fromTarget = posSpatialIdentity;
      toTarget = posTechNetwork;
      stageT = (p - 0.80) / 0.10;
      stageId = 'TECH';
    } else if (p < 0.96) {
      fromTarget = posTechNetwork;
      toTarget = posHeneoxyCore;
      stageT = (p - 0.90) / 0.06;
      stageId = 'CORE';
    } else {
      fromTarget = posHeneoxyCore;
      toTarget = posHeneoxyOS;
      stageT = (p - 0.96) / 0.04;
      stageId = 'OS';
    }

    // Quintic smoothstep for C1/C2 boundary continuity
    const smoothT = quinticSmoothstep(stageT);
    const env = Math.sin(smoothT * Math.PI);

    const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArr = positionsAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const idx3 = i * 3;
      const x1 = fromTarget[idx3];
      const y1 = fromTarget[idx3 + 1];
      const z1 = fromTarget[idx3 + 2];

      const x2 = toTarget[idx3];
      const y2 = toTarget[idx3 + 1];
      const z2 = toTarget[idx3 + 2];

      let targetX = x1 + (x2 - x1) * smoothT;
      let targetY = y1 + (y2 - y1) * smoothT;
      let targetZ = z1 + (z2 - z1) * smoothT;

      // Deterministic organic curved kinematics (strictly 0 at stage boundaries t=0 and t=1)
      if (env > 0.0001) {
        if (stageId === 'BREAK') {
          // Identity Break: Organic deterministic vortex expansion
          const goldenAngle = i * 2.39996323;
          const curlSign = i % 2 === 0 ? 1 : -1;
          const rDist = Math.hypot(x1, y1) + 0.3;
          const tangX = (-y1 / rDist) * curlSign;
          const tangY = (x1 / rDist) * curlSign;
          targetX += tangX * 0.38 * env;
          targetY += tangY * 0.38 * env;
          targetZ += Math.sin(goldenAngle * 2) * 0.22 * env;
        } else if (stageId === 'SPATIAL') {
          // Spatial Identity: Gravitational cluster swirl convergence
          const clusterIdx = i % 5;
          const swirlDir = clusterIdx % 2 === 0 ? 1 : -1;
          const swirlAngle = (1 - smoothT) * 1.8 * swirlDir + (i % 7) * 0.3;
          targetX += -Math.sin(swirlAngle) * 0.24 * env;
          targetY += Math.cos(swirlAngle) * 0.24 * env;
          targetZ += Math.sin(swirlAngle * 2) * 0.16 * env;
        } else if (stageId === 'TECH') {
          // Tech Network: Relational orbital alignment
          const phase = (i % 8) * 0.785398;
          targetX += Math.sin(smoothT * Math.PI + phase) * 0.12 * env;
          targetY += Math.cos(smoothT * Math.PI + phase) * 0.12 * env;
          targetZ += Math.sin(smoothT * Math.PI * 2 + phase) * 0.08 * env;
        } else if (stageId === 'CORE') {
          // Heneoxy Core: Singularity spiral convergence
          const spiralAngle = smoothT * Math.PI * 4 + i * 0.05;
          targetX += -Math.sin(spiralAngle) * 0.15 * env;
          targetY += Math.cos(spiralAngle) * 0.15 * env;
          targetZ += Math.sin(spiralAngle * 2) * 0.08 * env;
        } else if (stageId === 'OS') {
          // Heneoxy OS: Radial bloom
          targetX += Math.cos(i * 0.5) * 0.08 * env;
          targetY += Math.sin(i * 0.5) * 0.08 * env;
          targetZ += Math.cos(i * 0.3) * 0.05 * env;
        }
      }

      // Dedicated Foreground Stardust smooth cinematic drift across the formed letters
      const isLetter = i < letterTotalPoints;
      const isForeground = i >= letterTotalPoints && i < letterTotalPoints + foregroundCount;

      if (isForeground && (stageId === 'HOLD' || stageId === 'CONSTRUCTION_2')) {
        const fgIdx = i - letterTotalPoints;
        const driftSpeed = 0.35;
        const phase = fgIdx * 0.55;
        const driftX = reducedMotion ? 0 : Math.sin(time * driftSpeed + phase) * 0.24;
        const driftY = reducedMotion ? 0 : Math.cos(time * (driftSpeed * 0.8) + phase) * 0.12;
        const driftZ = reducedMotion ? 0 : Math.sin(time * (driftSpeed * 1.2) + phase) * 0.08;
        targetX += driftX;
        targetY += driftY;
        targetZ += driftZ;
      }

      // Subtle organic breathing oscillation (strictly 0 for letter particles during hold)
      const noiseAmp = reducedMotion
        ? 0
        : stageId === 'HOLD' && isLetter
          ? 0
          : stageId === 'HOLD' && isForeground
            ? 0.008
            : stageId === 'BREAK'
              ? 0.05
              : stageId === 'CORE'
                ? 0.025
                : 0.010;
      const noiseFreq = stageId === 'BREAK' ? 3.5 : stageId === 'CORE' ? 5.0 : 1.2;
      const subtleWobble = noiseAmp > 0 ? Math.sin(time * noiseFreq + i * 0.1) * noiseAmp : 0;

      // Cursor spring repulsion in physical typography & break stages
      let mouseRepelX = 0;
      let mouseRepelY = 0;
      let mouseRepelZ = 0;
      if (!isMobile && !hasTouch && !reducedMotion && p > 0.15 && p < 0.75) {
        const dx = targetX - pointer.x * 3.5;
        const dy = targetY - pointer.y * 2.5;
        const distSq = dx * dx + dy * dy;
        const maxDist = stageId === 'HOLD' ? 1.2 : 0.9;
        if (distSq < maxDist && distSq > 0.001) {
          const force = (maxDist - distSq) * (stageId === 'HOLD' ? 0.25 : 0.16);
          const dist = Math.sqrt(distSq);
          mouseRepelX = (dx / dist) * force;
          mouseRepelY = (dy / dist) * force;
          mouseRepelZ = (1.0 - dist / maxDist) * 0.12;
        }
      }

      posArr[idx3] = targetX + mouseRepelX + subtleWobble;
      posArr[idx3 + 1] = targetY + mouseRepelY + subtleWobble;
      posArr[idx3 + 2] = targetZ + mouseRepelZ + (stageId === 'CORE' && !reducedMotion ? Math.cos(time * 8 + i) * 0.03 : 0);
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
    if (ringsGroupRef.current && p > 0.90) {
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
            opacity={progress > 0.90 ? Math.min(0.45, (progress - 0.90) * 10 * 0.45) : 0}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 3.2, Math.PI / 6, 0]}>
          <ringGeometry args={[2.82, 2.86, 64]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={progress > 0.90 ? Math.min(0.35, (progress - 0.90) * 10 * 0.35) : 0}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 4. SPATIAL IDENTITY 5-NODE HOLOGRAPHIC CONSTELLATION SYSTEM */}
      <group visible={progress >= 0.65 && progress <= 0.82}>
        {/* Constellation Connecting Backbone Lines (Perimeter to Perimeter at Z = -0.10) */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[spatialLinePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#00F0FF"
            transparent
            opacity={
              progress < 0.68
                ? Math.max(0, (progress - 0.65) / 0.03) * 0.40
                : progress < 0.79
                ? 0.40
                : Math.max(0, 0.40 * (1 - (progress - 0.79) / 0.03))
            }
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        {/* 5 Distinct Holographic Reticle Rings, Radial Cardinal Ticks & Centered Labels */}
        {spatialNodes.map((node) => {
          const spatialOpacity =
            progress < 0.68
              ? Math.max(0, (progress - 0.65) / 0.03) * 0.65
              : progress < 0.79
              ? 0.65
              : Math.max(0, 0.65 * (1 - (progress - 0.79) / 0.03));

          const textOpacity =
            progress < 0.68
              ? Math.max(0, (progress - 0.65) / 0.03)
              : progress < 0.79
              ? 1.0
              : Math.max(0, 1.0 * (1 - (progress - 0.79) / 0.03));

          return (
            <group key={node.id} position={node.pos}>
              {/* Primary Outer Circular Halo Ring */}
              <mesh>
                <ringGeometry args={[node.r - 0.006, node.r + 0.006, 64]} />
                <meshBasicMaterial
                  color={node.color}
                  transparent
                  opacity={spatialOpacity}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Secondary Subtle Inner Guide Ring */}
              <mesh>
                <ringGeometry args={[node.r * 0.84 - 0.004, node.r * 0.84 + 0.004, 48]} />
                <meshBasicMaterial
                  color="#38BDF8"
                  transparent
                  opacity={spatialOpacity * 0.35}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Cardinal Precision Reticle Ticks */}
              <mesh position={[0, node.r, 0]}>
                <planeGeometry args={[0.010, 0.05]} />
                <meshBasicMaterial color={node.color} transparent opacity={spatialOpacity * 0.75} side={THREE.DoubleSide} />
              </mesh>
              <mesh position={[0, -node.r, 0]}>
                <planeGeometry args={[0.010, 0.05]} />
                <meshBasicMaterial color={node.color} transparent opacity={spatialOpacity * 0.75} side={THREE.DoubleSide} />
              </mesh>
              <mesh position={[node.r, 0, 0]}>
                <planeGeometry args={[0.05, 0.010]} />
                <meshBasicMaterial color={node.color} transparent opacity={spatialOpacity * 0.75} side={THREE.DoubleSide} />
              </mesh>
              <mesh position={[-node.r, 0, 0]}>
                <planeGeometry args={[0.05, 0.010]} />
                <meshBasicMaterial color={node.color} transparent opacity={spatialOpacity * 0.75} side={THREE.DoubleSide} />
              </mesh>

              {/* Perfectly Centered Dynamic Holographic Label */}
              <Html
                center
                style={{
                  opacity: textOpacity,
                  pointerEvents: 'none',
                  userSelect: 'none',
                  transition: 'opacity 0.15s ease-out',
                }}
              >
                {node.id === 'center' && (
                  <div className="text-center space-y-1 w-64 select-none pointer-events-none">
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-accent font-semibold block whitespace-nowrap">
                      SPATIAL TAXONOMY // CORE AXIS
                    </span>
                    <span className="font-editorial text-lg sm:text-xl font-bold uppercase tracking-tight text-foreground block whitespace-nowrap">
                      Four Spatial Pillars
                    </span>
                  </div>
                )}
                {node.id === 'engineering' && (
                  <div className="space-y-1 text-center w-36 sm:w-44 select-none pointer-events-none">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#00F0FF] tracking-wider uppercase block whitespace-nowrap">
                      ENGINEERING
                    </span>
                    <p className="font-sans text-[10px] sm:text-xs text-foreground-secondary italic whitespace-nowrap">
                      "I build things."
                    </p>
                  </div>
                )}
                {node.id === 'ai' && (
                  <div className="space-y-1 text-center w-36 sm:w-48 select-none pointer-events-none">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#38BDF8] tracking-wider uppercase block whitespace-nowrap">
                      AI &amp; COGNITION
                    </span>
                    <p className="font-sans text-[10px] sm:text-xs text-foreground-secondary italic whitespace-nowrap">
                      "I explore what they can become."
                    </p>
                  </div>
                )}
                {node.id === 'creative' && (
                  <div className="space-y-1 text-center w-36 sm:w-44 select-none pointer-events-none">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#EC4899] tracking-wider uppercase block whitespace-nowrap">
                      CREATIVE
                    </span>
                    <p className="font-sans text-[10px] sm:text-xs text-foreground-secondary italic whitespace-nowrap">
                      "I care how they feel."
                    </p>
                  </div>
                )}
                {node.id === 'systems' && (
                  <div className="space-y-1 text-center w-36 sm:w-44 select-none pointer-events-none">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#818CF8] tracking-wider uppercase block whitespace-nowrap">
                      SYSTEMS
                    </span>
                    <p className="font-sans text-[10px] sm:text-xs text-foreground-secondary italic whitespace-nowrap">
                      "I connect the pieces."
                    </p>
                  </div>
                )}
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
};

export default CinematicOpening3D;
