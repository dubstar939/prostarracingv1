/**
 * Game Audio Service - Manages all game sound effects and music
 * 
 * This service provides:
 * - Procedural sound generation for engine, drift, and effects
 * - Procedural Techno Music Sequencer - Dynamic, royalty-free background music
 * - Volume control and mute functionality
 * 
 * ROYALTY-FREE AUDIO SOURCES:
 * ---------------------------
 * To add royalty-free music and sound effects:
 * 
 * 1. OpenGameArt (https://opengameart.org/)
 *    - Search for "racing", "car", "engine", "drift"
 *    - Filter by license: CC0, CC-BY, CC-BY-SA
 *    - Download OGG or MP3 files
 *    - Place in /public/audio/ directory
 *    - Update the MUSIC_TRACKS and SFX_FILES objects below
 * 
 * 2. Freesound (https://freesound.org/)
 *    - Search for specific SFX: "tire screech", "turbo", "collision"
 *    - Filter by license: CC0 or Creative Commons
 *    - Download WAV or OGG files
 *    - Place in /public/audio/ directory
 *    - Update the SFX_FILES object below
 * 
 * 3. Itch.io Game Assets (https://itch.io/game-assets/free/tag-sound-effects)
 *    - Free game sound packs
 *    - Check individual licenses
 * 
 * EXAMPLE ATTRIBUTION:
 * --------------------
 * If using CC-BY licensed assets, add attribution in README.md:
 * 
 * ## Audio Assets
 * - "Racing Theme" by [Artist Name] from OpenGameArt.org (CC-BY 3.0)
 * - "Tire Screech" by [Artist Name] from Freesound.org (CC0)
 */

export class GameAudio {
  private ctx: AudioContext | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  
  private driftAudio: HTMLAudioElement | null = null;
  private turboAudio: HTMLAudioElement | null = null;
  private collisionAudio: HTMLAudioElement | null = null;
  private windAudio: HTMLAudioElement | null = null;
  private screechAudio: HTMLAudioElement | null = null;
  
  // Music sequencer
  private isMusicPlaying: boolean = false;
  private musicGain: GainNode | null = null;
  private nextNoteTime: number = 0;
  private currentStep: number = 0;
  private timerID: number | null = null;
  private tempo: number = 138; // Techno BPM
  private lookahead: number = 25.0; // ms
  private scheduleAheadTime: number = 0.1; // s
  
  // Sequencer Patterns (16 steps)
  private kickPattern =  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
  private snarePattern = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
  private hihatPattern = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  private bassPattern =  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0];
  
  private isMuted: boolean = false;
  private initialized: boolean = false;
  private currentTheme: string = 'mountain';

  constructor() {}

  public setTheme(theme: string) {
    this.currentTheme = theme;
  }

  public init() {
    if (this.initialized) return;
    
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create master gain for music
      const masterGain = this.ctx.createGain();
      masterGain.connect(this.ctx.destination);
      masterGain.gain.value = 0.5;
      
      this.musicGain = this.ctx.createGain();
      this.musicGain.connect(masterGain);
      this.musicGain.gain.value = 0.7;
      
      // Procedural Engine Sound
      this.engineOsc = this.ctx.createOscillator();
      this.engineOsc.type = 'sawtooth';
      
      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.value = 800;
      
      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.value = 0;
      
      this.engineOsc.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);
      
      this.engineOsc.start();

      // Drift Sound - procedural noise
      this.driftAudio = new Audio('');
      this.driftAudio.loop = true;
      this.driftAudio.volume = 0;
      this.driftAudio.preload = 'auto';

      // Tire Screech - procedural
      this.screechAudio = new Audio('');
      this.screechAudio.playbackRate = 1.5;
      this.screechAudio.volume = 0;
      this.screechAudio.preload = 'auto';

      // Turbo Sound - procedural
      this.turboAudio = new Audio('');
      this.turboAudio.volume = 0.4;
      this.turboAudio.preload = 'auto';

      // Collision Sound - procedural
      this.collisionAudio = new Audio('');
      this.collisionAudio.volume = 0.5;
      this.collisionAudio.preload = 'auto';

      // Wind/Ambient Sound - procedural
      this.windAudio = new Audio('');
      this.windAudio.loop = true;
      this.windAudio.volume = 0;
      this.windAudio.preload = 'auto';

      this.initialized = true;
    } catch (e) {
      console.error("Audio initialization failed", e);
    }
  }

  public update(speedPercent: number, isDrifting: boolean, isBraking: boolean) {
    if (!this.initialized || this.isMuted || !this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Update Procedural Engine Sound
    if (this.engineOsc && this.engineGain && this.engineFilter) {
      const baseFreq = this.currentTheme === 'city' ? 45 : 40; // Slightly higher pitch in city
      const targetFreq = baseFreq + (speedPercent * 120);
      this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
      
      // Filter opens up as speed increases
      this.engineFilter.frequency.setTargetAtTime(400 + (speedPercent * 2000), this.ctx.currentTime, 0.1);
      
      const targetGain = 0.05 + (speedPercent * 0.15);
      this.engineGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }

    // Update Wind Sound (Theme-based)
    if (this.windAudio) {
      if (this.windAudio.paused && speedPercent > 0.1) {
        this.windAudio.play().catch(() => {});
      }
      
      let windVol = Math.min(0.4, speedPercent * 0.6);
      if (this.currentTheme === 'desert') windVol *= 1.2; // Louder wind in desert
      if (this.currentTheme === 'mountain') windVol *= 0.8; // Quieter wind in mountains (echoes instead)
      
      this.windAudio.volume = windVol;
      this.windAudio.playbackRate = 0.8 + (speedPercent * 0.5);
    }

    // Update Drift/Brake Sound
    if (this.driftAudio && this.screechAudio) {
      const shouldPlayDrift = isDrifting || (isBraking && speedPercent > 0.2);
      if (shouldPlayDrift) {
        if (this.driftAudio.paused) this.driftAudio.play().catch(() => {});
        if (this.screechAudio.paused && isDrifting) this.screechAudio.play().catch(() => {});
        
        this.driftAudio.volume = 0.3;
        this.screechAudio.volume = isDrifting ? 0.4 : 0;
      } else {
        this.driftAudio.volume = 0;
        this.screechAudio.volume = 0;
        if (!this.driftAudio.paused) this.driftAudio.pause();
        if (!this.screechAudio.paused) this.screechAudio.pause();
      }
    }
  }

  public playCollision(impact: number) {
    if (!this.initialized || this.isMuted || !this.collisionAudio) return;
    const sound = this.collisionAudio.cloneNode() as HTMLAudioElement;
    sound.volume = Math.min(0.8, impact);
    sound.play().catch(() => {});
  }

  public playTurbo() {
    if (!this.initialized || this.isMuted || !this.turboAudio) return;
    const sound = this.turboAudio.cloneNode() as HTMLAudioElement;
    sound.play().catch(() => {});
  }

  public startMusic() {
    if (!this.initialized || !this.ctx) return;
    
    this.isMusicPlaying = true;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.currentStep = 0;
    this.scheduler();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.timerID) {
      window.clearTimeout(this.timerID);
      this.timerID = null;
    }
    // Fade out music
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
    }
    if (this.engineGain) {
      this.engineGain.gain.setTargetAtTime(0, this.ctx?.currentTime || 0, 0.1);
    }
    if (this.windAudio) {
      this.windAudio.pause();
    }
  }

  // --- Music Sequencer Engine ---

  private scheduler() {
    if (!this.isMusicPlaying || !this.ctx) return;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentStep, this.nextNoteTime);
      this.nextStep();
    }
    this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
  }

  private nextStep() {
    const secondsPerBeat = 60.0 / this.tempo;
    const secondsPer16th = secondsPerBeat / 4;
    this.nextNoteTime += secondsPer16th;
    this.currentStep = (this.currentStep + 1) % 16;
  }

  private scheduleNote(step: number, time: number) {
    if (!this.ctx || !this.musicGain) return;

    if (this.kickPattern[step]) this.playKick(time);
    if (this.snarePattern[step]) this.playSnare(time);
    if (this.hihatPattern[step]) this.playHiHat(time, step % 2 === 0);
    if (this.bassPattern[step]) this.playBass(time, step);
  }

  private playKick(time: number) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    
    osc.connect(gain);
    gain.connect(this.musicGain!);

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    osc.start(time);
    osc.stop(time + 0.5);
  }

  private playSnare(time: number) {
    const bufferSize = this.ctx!.sampleRate * 0.5;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = this.ctx!.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    
    const noiseEnvelope = this.ctx!.createGain();
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseEnvelope);
    noiseEnvelope.connect(this.musicGain!);

    noiseEnvelope.gain.setValueAtTime(0.8, time);
    noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    
    noise.start(time);
    noise.stop(time + 0.2);

    const osc = this.ctx!.createOscillator();
    osc.type = 'triangle';
    const oscEnv = this.ctx!.createGain();
    osc.connect(oscEnv);
    oscEnv.connect(this.musicGain!);
    
    osc.frequency.setValueAtTime(250, time);
    oscEnv.gain.setValueAtTime(0.4, time);
    oscEnv.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    
    osc.start(time);
    osc.stop(time + 0.1);
  }

  private playHiHat(time: number, isOpen: boolean) {
    const bufferSize = this.ctx!.sampleRate * 0.5;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      if (i % 2 === 0) data[i] = Math.random() * 2 - 1;
      else data[i] = 0; 
    }

    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;

    const gain = this.ctx!.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain!);

    const duration = isOpen ? 0.3 : 0.05;
    const vol = isOpen ? 0.3 : 0.2;

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    noise.start(time);
    noise.stop(time + duration);
  }

  private playBass(time: number, step: number) {
    const osc = this.ctx!.createOscillator();
    osc.type = 'sawtooth';
    
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 5;
    
    const gain = this.ctx!.createGain();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain!);

    let freq = 55;
    if (step % 4 === 2) freq = 65.41;
    if (step % 8 === 4) freq = 49.00;
    
    osc.frequency.setValueAtTime(freq, time);
    
    filter.frequency.setValueAtTime(200, time);
    filter.frequency.exponentialRampToValueAtTime(800, time + 0.1);
    filter.frequency.exponentialRampToValueAtTime(200, time + 0.3);

    gain.gain.setValueAtTime(0.6, time);
    gain.gain.linearRampToValueAtTime(0, time + 0.4);

    osc.start(time);
    osc.stop(time + 0.4);
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.engineGain) this.engineGain.gain.value = 0;
      if (this.driftAudio) this.driftAudio.volume = 0;
      if (this.windAudio) this.windAudio.volume = 0;
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.isMuted;
  }
}

export const audioManager = new GameAudio();
