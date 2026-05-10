/**
 * Game Audio Service - Manages all game sound effects and music
 * 
 * This service provides:
 * - Procedural sound generation for engine, drift, and effects
 * - Background music support with theme-based tracks
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
  private music: HTMLAudioElement | null = null;
  
  private isMuted: boolean = false;
  private initialized: boolean = false;
  private currentTheme: string = 'mountain';

  // Royalty-free music tracks by theme (add your downloaded files here)
  private MUSIC_TRACKS: Record<string, string> = {
    // Default racing theme music - procedurally generated (CC0)
    'mountain': '/audio/music_racing.wav',
    'city': '/audio/music_racing.wav',
    'desert': '/audio/music_racing.wav',
    'neon_city': '/audio/music_racing.wav',
    'touge': '/audio/music_racing.wav',
  };

  // Sound effect files (add your downloaded files here)
  private SFX_FILES: Record<string, string> = {
    // Example: Add downloaded SFX from Freesound
    // 'drift': '/audio/drift_sound.wav',
    // 'screech': '/audio/tire_screech.wav',
    // 'turbo': '/audio/turbo_boost.wav',
    // 'collision': '/audio/collision.wav',
    // Default: procedural audio only
  };

  constructor() {}

  public setTheme(theme: string) {
    this.currentTheme = theme;
  }

  public init() {
    if (this.initialized) return;
    
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
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

      // Load SFX from files if available, otherwise use procedural audio
      // Drift Sound
      this.driftAudio = new Audio(this.SFX_FILES['drift'] || '');
      this.driftAudio.loop = true;
      this.driftAudio.volume = 0;
      this.driftAudio.preload = 'auto';

      // Tire Screech
      this.screechAudio = new Audio(this.SFX_FILES['screech'] || '');
      this.screechAudio.playbackRate = 1.5;
      this.screechAudio.volume = 0;
      this.screechAudio.preload = 'auto';

      // Turbo Sound
      this.turboAudio = new Audio(this.SFX_FILES['turbo'] || '');
      this.turboAudio.volume = 0.4;
      this.turboAudio.preload = 'auto';

      // Collision Sound
      this.collisionAudio = new Audio(this.SFX_FILES['collision'] || '');
      this.collisionAudio.volume = 0.5;
      this.collisionAudio.preload = 'auto';

      // Wind/Ambient Sound
      this.windAudio = new Audio(this.SFX_FILES['wind'] || '');
      this.windAudio.loop = true;
      this.windAudio.volume = 0;
      this.windAudio.preload = 'auto';

      // Background Music - load based on current theme
      const musicPath = this.MUSIC_TRACKS[this.currentTheme];
      if (musicPath) {
        this.music = new Audio(musicPath);
        this.music.loop = true;
        this.music.volume = 0.5;
        this.music.preload = 'auto';
      } else {
        this.music = null;
      }

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
    if (this.music && !this.isMuted) {
      this.music.play().catch(e => console.log("Music play blocked", e));
    }
  }

  public stopMusic() {
    if (this.music) {
      this.music.pause();
    }
    if (this.engineGain) {
      this.engineGain.gain.setTargetAtTime(0, this.ctx?.currentTime || 0, 0.1);
    }
    if (this.windAudio) {
      this.windAudio.pause();
    }
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
