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
  /**
   * Live stage telemetry source: a mutable ref holding { id, envelope } updated
   * every frame by the particle system. Reading a ref (rather than a React
   * prop) keeps per-frame effect choreography immune to render batching —
   * a stale `envelope` prop would zero the glitch pulse mid-stage.
   */
  stageTelemetryRef?: { current: { id: string; envelope: number } };
  /** Fallback stage id when no telemetry ref is provided */
  stageId?: string;
  /** Fallback envelope when no telemetry ref is provided */
  stageEnvelope?: number;
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
  stageTelemetryRef,
  stageId: stageIdProp = 'DORMANT',
  stageEnvelope = 0,
}) => {
  const reducedMotion = useReducedMotion();

  // Live per-frame stage reads (refs bypass render batching)
  const liveStageId = stageTelemetryRef?.current?.id ?? stageIdProp;

  // Effect refs for per-frame uniform updates
  const bloomRef = useRef<any>(null);
  const caRef = useRef<any>(null);

  // Glitch-heavy stages get an aberration spike; bloom-heavy stages get luminous plasma
  const isBreakStage = liveStageId === 'BREAK';
  const isCoreStage = liveStageId === 'CORE' || liveStageId === 'OS';
  const isFieldStage = liveStageId === 'FIELD' || liveStageId === 'CONSTRUCTION_1' || liveStageId === 'CONSTRUCTION_2';

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
    // Read the freshest stage state every frame — never trust render-time props
    const frameStageId = stageTelemetryRef?.current?.id ?? stageIdProp;
    const frameEnvelope = stageTelemetryRef?.current?.envelope ?? stageEnvelope;
    const frameBreak = frameStageId === 'BREAK';

    if (bloomRef.current) {
      const u = bloomRef.current.uniforms?.get?.('intensity');
      if (u) {
        u.value = THREE.MathUtils.lerp(u.value, bloomTarget, lerpSpeed);
      } else if (typeof bloomRef.current.intensity === 'number') {
        // Fallback API path: postprocessing exposes a direct intensity setter
        bloomRef.current.intensity = THREE.MathUtils.lerp(bloomRef.current.intensity, bloomTarget, lerpSpeed);
      }
    }

    if (caRef.current) {
      const u = caRef.current.uniforms?.get?.('offset');
      const pulse = frameBreak
        ? 1 + Math.sin(progress * Math.PI * 24) * 0.35 * frameEnvelope // glitch flicker
        : 1;
      if (u && u.value) {
        u.value.x = THREE.MathUtils.lerp(u.value.x, caTarget.x * pulse, lerpSpeed);
        u.value.y = THREE.MathUtils.lerp(u.value.y, caTarget.y * pulse, lerpSpeed);
      } else if (caRef.current.offset) {
        // Fallback API path: ChromaticAberrationEffect.offset is a Vector2 property
        caRef.current.offset.x = THREE.MathUtils.lerp(caRef.current.offset.x, caTarget.x * pulse, lerpSpeed);
        caRef.current.offset.y = THREE.MathUtils.lerp(caRef.current.offset.y, caTarget.y * pulse, lerpSpeed);
      }
    }

    // Development-only telemetry for live effect audits
    if (Boolean(import.meta.env.DEV) && typeof window !== 'undefined') {
      (window as any).__STAGE_FX__ = {
        stageId: frameStageId,
        bloom: bloomRef.current?.uniforms?.get?.('intensity')?.value ?? bloomRef.current?.intensity ?? null,
        caOffset: caRef.current?.uniforms?.get?.('offset')?.value
          ? { x: caRef.current.uniforms.get('offset').value.x, y: caRef.current.uniforms.get('offset').value.y }
          : caRef.current?.offset
          ? { x: caRef.current.offset.x, y: caRef.current.offset.y }
          : null,
        bloomPath: bloomRef.current?.uniforms?.get?.('intensity') ? 'uniforms' : (typeof bloomRef.current?.intensity === 'number' ? 'property' : 'none'),
        caPath: caRef.current?.uniforms?.get?.('offset') ? 'uniforms' : (caRef.current?.offset ? 'property' : 'none'),
      };
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
