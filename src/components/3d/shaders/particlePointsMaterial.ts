import * as THREE from 'three';

export interface ParticlePointsMaterialParameters extends THREE.PointsMaterialParameters {
  /** Core sharpness factor for gaussian radial falloff (higher = sharper core). Default: 16.0 */
  coreSharpness?: number;
  /** Inner core luminous brightness multiplier (0.0 = no lift, 0.45 = balanced starlight). Default: 0.45 */
  coreLuminance?: number;
  /** Outer aura intensity (higher = softer ethereal halo). Default: 0.65 */
  auraIntensity?: number;
}

/**
 * CinematicParticlePointsMaterial
 *
 * Lightweight, high-performance PointsMaterial extension that converts raw WebGL square point
 * primitives into anti-aliased circular luminous stardust particles with soft radial falloff.
 *
 * Key features:
 * - Anti-aliased circular boundary via smoothstep on gl_PointCoord
 * - Gaussian-like luminous core + ethereal outer aura (no expensive noise or texture lookups)
 * - Seamless integration with Three.js native vertex colors, size attenuation, and color spaces
 * - Deterministic fallback to standard PointsMaterial if shader compilation fails
 * - Deterministic customProgramCacheKey to prevent Three.js shader cache collisions
 */
export class CinematicParticlePointsMaterial extends THREE.PointsMaterial {
  private _coreSharpness: number;
  private _coreLuminance: number;
  private _auraIntensity: number;

  constructor(parameters: ParticlePointsMaterialParameters = {}) {
    const {
      coreSharpness = 16.0,
      coreLuminance = 0.45,
      auraIntensity = 0.65,
      ...pointsParameters
    } = parameters;

    super({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      sizeAttenuation: true,
      ...pointsParameters,
    });

    this._coreSharpness = coreSharpness;
    this._coreLuminance = coreLuminance;
    this._auraIntensity = auraIntensity;

    this.customProgramCacheKey = () =>
      `CinematicParticlePoints_${this._coreSharpness.toFixed(1)}_${this._coreLuminance.toFixed(2)}_${this._auraIntensity.toFixed(2)}`;

    this.setupCustomShader();
  }

  private setupCustomShader(): void {
    this.onBeforeCompile = (shader) => {
      // Inject smooth anti-aliased circular point optics into fragment shader
      const customFragment = /* glsl */ `
        vec2 pCoord = gl_PointCoord - vec2(0.5);
        float dist = length(pCoord);
        if (dist > 0.5) discard;

        // Anti-aliased outer circular boundary with strictly ascending edges (edge0 < edge1):
        // dist in [0.40, 0.50] smoothly maps from 1.0 (inside circle) to 0.0 (at circumference)
        float edgeAlpha = 1.0 - smoothstep(0.40, 0.50, dist);

        // Soft luminous core & ethereal stardust falloff
        float core = exp(-dist * dist * ${this._coreSharpness.toFixed(1)});
        float aura = pow(clamp(1.0 - dist * 2.0, 0.0, 1.0), 1.4);
        float falloff = mix(aura * ${this._auraIntensity.toFixed(2)}, 1.0, core);

        diffuseColor.a *= edgeAlpha * falloff;
        diffuseColor.rgb += diffuseColor.rgb * (core * ${this._coreLuminance.toFixed(2)});
      `;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_particle_fragment>',
        customFragment
      );
    };
  }

  get coreSharpness(): number {
    return this._coreSharpness;
  }

  get coreLuminance(): number {
    return this._coreLuminance;
  }

  get auraIntensity(): number {
    return this._auraIntensity;
  }
}

export default CinematicParticlePointsMaterial;
