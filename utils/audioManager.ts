// Procedural Web Audio Synthesizer for Melodies & Sound Effects

type SoundEffectType = 'pop' | 'blow' | 'cheer' | 'horn' | 'chime' | 'unwrap' | 'sparkle';

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private musicTimeout: NodeJS.Timeout | null = null;
  private currentTrack: string = 'none';

  private initContext(): AudioContext | null {
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

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopMusic();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playSFX(type: SoundEffectType) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (type) {
      case 'pop': {
        // Balloon pop sound (sharp noise burst + downward pitch punch)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.09);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case 'blow': {
        // Blowing out candle: filtered white noise rush
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.linearRampToValueAtTime(300, now + 0.4);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.4);
        break;
      }

      case 'cheer': {
        // Cheerful fanfare chime chord
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.3, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 1.3);
        });
        break;
      }

      case 'horn': {
        // Party horn toot
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(450, now + 0.2);
        osc.frequency.linearRampToValueAtTime(430, now + 0.45);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }

      case 'chime':
      case 'sparkle': {
        // Magical fairy sparkle / chime
        const freqs = [1046.50, 1318.51, 1567.98, 2093.00];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);

          gain.gain.setValueAtTime(0.2, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.8);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.85);
        });
        break;
      }

      case 'unwrap': {
        // Box unwrap whoosh & pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
    }
  }

  /**
   * Plays Happy Birthday melody in procedural styles (Lo-Fi, 8-Bit Synth, Orchestral Bell, Festive)
   */
  public playMusic(track: 'festive' | 'chill-lofi' | 'orchestral' | 'synthwave' | 'acoustic' | 'none') {
    if (this.isMuted || track === 'none') {
      this.stopMusic();
      return;
    }

    this.stopMusic();
    this.currentTrack = track;
    this.isMusicPlaying = true;

    const ctx = this.initContext();
    if (!ctx) return;

    // Happy Birthday notes (in Hz) & duration (in beats)
    // C4, C4, D4, C4, F4, E4 | C4, C4, D4, C4, G4, F4 | C4, C4, C5, A4, F4, E4, D4 | Bb4, Bb4, A4, F4, G4, F4
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25;

    const melody: Array<{ note: number; duration: number }> = [
      { note: C4, duration: 0.75 },
      { note: C4, duration: 0.25 },
      { note: D4, duration: 1.0 },
      { note: C4, duration: 1.0 },
      { note: F4, duration: 1.0 },
      { note: E4, duration: 2.0 },

      { note: C4, duration: 0.75 },
      { note: C4, duration: 0.25 },
      { note: D4, duration: 1.0 },
      { note: C4, duration: 1.0 },
      { note: G4, duration: 1.0 },
      { note: F4, duration: 2.0 },

      { note: C4, duration: 0.75 },
      { note: C4, duration: 0.25 },
      { note: C5, duration: 1.0 },
      { note: A4, duration: 1.0 },
      { note: F4, duration: 1.0 },
      { note: E4, duration: 1.0 },
      { note: D4, duration: 2.0 },

      { note: Bb4, duration: 0.75 },
      { note: Bb4, duration: 0.25 },
      { note: A4, duration: 1.0 },
      { note: F4, duration: 1.0 },
      { note: G4, duration: 1.0 },
      { note: F4, duration: 2.5 }
    ];

    const tempoMap: Record<string, number> = {
      'festive': 0.45,
      'chill-lofi': 0.65,
      'orchestral': 0.55,
      'synthwave': 0.42,
      'acoustic': 0.58
    };

    const beatLength = tempoMap[track] || 0.5;

    const playSequence = () => {
      if (!this.isMusicPlaying || this.isMuted) return;
      const currentNow = ctx.currentTime;
      let offset = 0;

      melody.forEach(({ note, duration }) => {
        const startTime = currentNow + offset;
        const noteDuration = duration * beatLength;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        if (track === 'synthwave') {
          osc.type = 'sawtooth';
          gain.gain.setValueAtTime(0.08, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration * 0.9);
        } else if (track === 'chill-lofi') {
          osc.type = 'triangle';
          gain.gain.setValueAtTime(0.12, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration * 1.1);
        } else if (track === 'orchestral') {
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.15, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration * 1.3);
        } else {
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.12, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration * 0.95);
        }

        osc.frequency.setValueAtTime(note, startTime);
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + noteDuration * 1.3);

        offset += noteDuration;
      });

      // Loop after full melody completes (+ 2 second pause)
      const totalDuration = (offset + 2) * 1000;
      this.musicTimeout = setTimeout(() => {
        if (this.isMusicPlaying) {
          playSequence();
        }
      }, totalDuration);
    };

    playSequence();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }
}

export const audio = new AudioManager();
