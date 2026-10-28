import confetti from 'canvas-confetti';

export interface TimeTogether {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

/**
 * Calculates time together since an anniversary start date.
 * Defaults to 90 days prior to the current date if no date passed.
 */
export function calculateTimeTogether(startDateMs: number, currentMs: number = Date.now()): TimeTogether {
  const diff = Math.max(0, currentMs - startDateMs);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalDays: days,
  };
}

/**
 * Validates whether coupon can be redeemed
 */
export function canRedeemCoupon(couponId: string, redeemedIds: string[]): boolean {
  if (!couponId || typeof couponId !== 'string') return false;
  return !redeemedIds.includes(couponId);
}

/**
 * Trigger celebration confetti with heart and pastel shapes
 */
export function fireLoveConfetti(originX = 0.5, originY = 0.6) {
  try {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: Math.max(0, originX - 0.1), y: originY },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#fef08a'],
      scalar: 1.2,
    });
    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: Math.min(1, originX + 0.1), y: originY },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#fef08a'],
      scalar: 1.2,
    });
  } catch {
    // Ignore in non-browser envs
  }
}

/**
 * Web Audio Synthesizer for romantic ambient soundscapes and SFX
 */
class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingAmbience = false;
  private ambienceTimer: number | null = null;
  private currentTrack = 0;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft romantic chime sound
  playChime() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.7);
    });
  }

  // Gentle heart pop sound
  playPop() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.08);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Play gentle lofi chord progression
  toggleAmbience(on?: boolean, trackIndex = 0): boolean {
    this.initCtx();
    if (!this.ctx) return false;

    if (on === false || (on === undefined && this.isPlayingAmbience)) {
      this.stopAmbience();
      return false;
    }

    this.stopAmbience();
    this.isPlayingAmbience = true;
    this.currentTrack = trackIndex;
    this.scheduleChordLoop();
    return true;
  }

  private stopAmbience() {
    this.isPlayingAmbience = false;
    if (this.ambienceTimer) {
      window.clearInterval(this.ambienceTimer);
      this.ambienceTimer = null;
    }
  }

  private scheduleChordLoop() {
    if (!this.isPlayingAmbience) return;
    // Romantic chord progressions (frequencies in Hz: Fmaj7 -> G6 -> Em7 -> Am9)
    const progressions = [
      [
        [174.61, 261.63, 329.63, 349.23], // Fmaj7
        [196.00, 246.94, 293.66, 392.00], // G
        [164.81, 246.94, 329.63, 392.00], // Em7
        [220.00, 261.63, 329.63, 440.00, 493.88], // Am9
      ],
      [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ]
    ];

    const currentProgression = progressions[this.currentTrack % progressions.length];
    let chordIdx = 0;

    const playNextChord = () => {
      if (!this.isPlayingAmbience || !this.ctx) return;
      const chord = currentProgression[chordIdx % currentProgression.length];
      chordIdx++;
      const now = this.ctx.currentTime;

      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);

        // Soft, blooming swell
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + 3.4);
      });
    };

    // Play first chord immediately
    playNextChord();
    this.ambienceTimer = window.setInterval(playNextChord, 3500);
  }

  isAmbiencePlaying(): boolean {
    return this.isPlayingAmbience;
  }
}

export const romanticAudio = new RomanticAudioEngine();
