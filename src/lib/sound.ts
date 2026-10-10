/**
 * Lightweight Procedural Web Audio Synthesizer
 * Zero audio assets downloaded. 100% synthesized in Web Audio API.
 * Strict Policy: Never autoplays. Defaults to MUTED.
 */

class ProceduralSoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hp_sound_enabled');
      this.enabled = saved === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal: number = 0.03): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext unavailable or blocked by browser policy
    }
  }

  public playClick(): void {
    this.playTone(1800, 0.03, 'triangle', 0.02);
  }

  public playHover(): void {
    this.playTone(2400, 0.02, 'sine', 0.015);
  }

  public playTransition(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext unavailable
    }
  }

  public playReboot(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext unavailable
    }
  }

  // ─── Ambient drone pad ────────────────────────────────────────────────
  private droneNodes: { osc: OscillatorNode[]; gain: GainNode[]; lfo: OscillatorNode } | null = null;

  /**
   * Low ambient atmosphere: two detuned sine drones (55Hz + 82.5Hz, an
   * octave+fifth apart) with a slow LFO breathing the level. Starts only
   * when audio is enabled; fades in over ~2s.
   */
  public startAmbientDrone(): void {
    if (!this.enabled || this.droneNodes) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.018, ctx.currentTime + 2.0);
      master.connect(ctx.destination);

      const freqs = [55, 82.5, 110.3];
      const osc: OscillatorNode[] = [];
      const gain: GainNode[] = [];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = f + (i === 1 ? 0.4 : 0); // subtle detune shimmer
        const g = ctx.createGain();
        g.gain.value = i === 0 ? 1.0 : i === 1 ? 0.5 : 0.22;
        o.connect(g);
        g.connect(master);
        o.start();
        osc.push(o);
        gain.push(g);
      });

      // Breathing LFO on the master level (0.06 Hz — ~16s cycle)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.06;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.006;
      lfo.connect(lfoGain);
      lfoGain.connect(master.gain);
      lfo.start();

      this.droneNodes = { osc, gain, lfo };
    } catch {
      // AudioContext unavailable
    }
  }

  public stopAmbientDrone(): void {
    if (!this.droneNodes) return;
    try {
      const ctx = this.ctx;
      const d = this.droneNodes;
      if (ctx) {
        d.osc.forEach((o) => {
          try { o.stop(ctx.currentTime + 0.8); } catch { /* already stopped */ }
        });
        try { d.lfo.stop(ctx.currentTime + 0.8); } catch { /* already stopped */ }
      }
      this.droneNodes = null;
    } catch {
      // context gone
    }
  }

  public setEnabled(val: boolean): void {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('hp_sound_enabled', val ? 'true' : 'false');
    }
    if (val) {
      this.getContext();
      this.playTone(880, 0.04, 'sine', 0.05);
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
  }
}

export const soundEngine = new ProceduralSoundEngine();
