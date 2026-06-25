/**
 * SoundEngine generates every game sound on the fly using the Web Audio
 * API — no external audio files, no network requests. A single
 * AudioContext is created lazily (browsers block autoplay until a user
 * gesture) and reused for the lifetime of the game.
 */
export class SoundEngine {
  private context: AudioContext | null = null;
  private musicNodes: { stop: () => void } | null = null;

  /** Lazily creates (or resumes) the shared AudioContext. */
  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.context) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.context = new AudioCtx();
    }

    if (this.context.state === "suspended") {
      void this.context.resume();
    }

    return this.context;
  }

  /** Plays a simple sine/triangle tone at the given frequency. */
  private playTone(
    frequency: number,
    durationSec: number,
    options: {
      type?: OscillatorType;
      volume?: number;
      delaySec?: number;
      glideToFrequency?: number;
    } = {}
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const {
      type = "sine",
      volume = 0.18,
      delaySec = 0,
      glideToFrequency,
    } = options;

    const startTime = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);

    if (glideToFrequency) {
      osc.frequency.exponentialRampToValueAtTime(
        glideToFrequency,
        startTime + durationSec
      );
    }

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + durationSec + 0.02);
  }

  /** Tone played while a tile lights up during sequence playback. */
  playSequenceTone(frequency: number, durationSec: number): void {
    this.playTone(frequency, durationSec, { type: "triangle", volume: 0.2 });
  }

  /** Bright, short confirmation tone for a correct player click. */
  playCorrectClick(frequency: number): void {
    this.playTone(frequency, 0.16, { type: "sine", volume: 0.22 });
  }

  /** Harsh descending buzz for a wrong click. */
  playWrongClick(): void {
    this.playTone(180, 0.35, {
      type: "sawtooth",
      volume: 0.2,
      glideToFrequency: 70,
    });
  }

  /** Ascending arpeggio played when a round completes successfully. */
  playRoundComplete(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      this.playTone(freq, 0.18, {
        type: "sine",
        volume: 0.16,
        delaySec: i * 0.08,
      });
    });
  }

  /** Big victory fanfare for crossing milestone rounds (e.g. round 10+). */
  playVictoryFanfare(): void {
    const notes = [523.25, 523.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, i) => {
      this.playTone(freq, 0.3, {
        type: "triangle",
        volume: 0.18,
        delaySec: i * 0.12,
      });
    });
  }

  /** Somber descending tone sequence for game over. */
  playGameOver(): void {
    const notes = [392, 349.23, 293.66, 196];
    notes.forEach((freq, i) => {
      this.playTone(freq, 0.4, {
        type: "sawtooth",
        volume: 0.14,
        delaySec: i * 0.18,
      });
    });
  }

  /** Quick low tick for each countdown beat. */
  playCountdownTick(isLast: boolean): void {
    this.playTone(isLast ? 880 : 440, 0.15, {
      type: "square",
      volume: 0.12,
    });
  }

  /** UI hover/press blip for buttons. */
  playUiClick(): void {
    this.playTone(660, 0.08, { type: "sine", volume: 0.1 });
  }

  /**
   * Starts a soft ambient pad loop for "music". Built from a few slow
   * detuned oscillators rather than a sample, looped manually via
   * setInterval-free chained scheduling.
   */
  startAmbientMusic(): void {
    const ctx = this.getContext();
    if (!ctx || this.musicNodes) return;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.05;
    masterGain.connect(ctx.destination);

    const baseFreqs = [110, 146.83, 164.81];
    const oscillators: OscillatorNode[] = [];

    baseFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.02;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 4;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.6;

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start();
      lfo.start();
      oscillators.push(osc, lfo);
    });

    this.musicNodes = {
      stop: () => {
        oscillators.forEach((osc) => {
          try {
            osc.stop();
          } catch {
            // already stopped — safe to ignore
          }
        });
        masterGain.disconnect();
      },
    };
  }

  stopAmbientMusic(): void {
    this.musicNodes?.stop();
    this.musicNodes = null;
  }

  /** Releases the AudioContext entirely (used on full unmount). */
  dispose(): void {
    this.stopAmbientMusic();
    this.context?.close();
    this.context = null;
  }
}
