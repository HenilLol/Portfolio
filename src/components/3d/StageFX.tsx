import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface StageFXProps {
  /** Normalized opening timeline 0..1 (same driver as particle morphing) */
  progress: number;
  /** Normalized within-stage easing 0..1, used to spike effects at stage midpoints */
  stageEnvelope: number;
  /** Current stage identifier, used to intensify effects at narrative peaks */
  stageId: string;
}

/**
 * Cinematic post-processing stack for the opening experience.
 *
 * - Bloom: turns additive-blended particles into volumetric neon plasma.
 *   Intensity ramps during particle-heavy stages (FIELD, BREAK, CORE).
 * - ChromaticAberration: RGB split spikes during IDENTITY BREAK and
 *   the HENEOXY singularity convergence — the "glitch" moments.
 * - Vignette: subtle framing that keeps focus centered.
 * - Noise: faint film grain that sells the analog/cinematic feel.
 *
 * All uniforms are driven from the same scroll timeline as the geometry,
 * so effects choreograph exactly with the narrative stages.
 */
export const StageFX: React.FC<StageFXProps> = ({
  progress,
  stageEnvelope,
  stageId,
}) => {
  const reducedMotion = useReducedMotion();

  // Effect refs for per-frame uniform updates
  const bloomRef = useRef<any>(null);
  const caRef = useRef<any>(null);

  // Glitch-heavy stages get an aberration spike; bloom-heavy stages get luminous plasma
  const isBreakStage = stageId === 'BREAK';
  const isCoreStage = stageId === 'CORE' || stageId === 'OS';
  const isFieldStage = stageId === 'FIELD' || stageId === 'CONSTRUCTION_1' || stageId === 'CONSTRUCTION_2';

  const bloomBase = reducedMotion ? 0.35 : 1.35;
  const bloomPeak = reducedMotion ? 0.55 : 2.30;

  // Chromatic offset target: near-zero at rest, spikes at narrative glitch moments
  const caTarget = useMemo(() => {
    if (reducedMotion) return new THREE.Vector2(0.0004, 0.0004);
    if (isBreakStage) return new THREE.Vector2(0.0060, 0.0042);
    if (isCoreStage) return new THREE.Vector2(0.0038, 0.0028);
    return new THREE.Vector2(0.0012, 0.0009);
  }, [reducedMotion, isBreakStage, isCoreStage]);

  // Bloom intensity target per stage
  const bloomTarget = useMemo(() => {
    if (reducedMotion) return 0.35;
    if (isFieldStage) return bloomPeak; // matter converging = full plasma
    if (isBreakStage) return bloomPeak * 1.05; // fracture = blinding disintegration
    if (isCoreStage) return bloomPeak * 0.9;
    return bloomBase; // HOLD (typography) stays crisp but still luminous
  }, [reducedMotion, isFieldStage, isBreakStage, isCoreStage, bloomBase, bloomPeak]);

  // Smoothly ease effect uniforms toward targets — same lerp family as camera/particles
  useFrame((_, delta) => {
    const lerpSpeed = Math.min(delta * 4.0, 0.18);

    if (bloomRef.current) {
      const u = bloomRef.current.uniforms?.get?.('intensity');
      if (u) {
        u.value = THREE.MathUtils.lerp(u.value, bloomTarget, lerpSpeed);
      }
    }

    if (caRef.current) {
      const u = caRef.current.uniforms?.get?.('offset');
      if (u && u.value) {
        const pulse = isBreakStage
          ? 1 + Math.sin(progress * Math.PI * 24) * 0.35 * stageEnvelope // glitch flicker
          : 1;
        u.value.x = THREE.MathUtils.lerp(u.value.x, caTarget.x * pulse, lerpSpeed);
        u.value.y = THREE.MathUtils.lerp(u.value.y, caTarget.y * pulse, lerpSpeed);
      }
    }
  });

  // Bail out entirely when motion is reduced to a static profile — keeps the scene legible
  if (reducedMotion) return null;

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        ref={bloomRef}
        intensity={bloomBase}
        luminanceThreshold={0.08}
        luminanceSmoothing={0.6}
        mipmapBlur
        radius={0.85}
      />
      <ChromaticAberration
        ref={caRef}
        offset={caTarget}
        radialModulation={true}
        modulationOffset={0.42}
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.12} />
      <Vignette eskil={false} offset={0.18} darkness={0.82} />
    </EffectComposer>
  );
};

export default StageFX;
