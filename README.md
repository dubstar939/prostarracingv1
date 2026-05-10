# Pro Star-Racing

A high-octane racing game built with React Three Fiber and Cannon Physics.

## Features

- 🏎️ Realistic car physics with drift mechanics
- 🌃 Multiple track themes (Neon City, Mountain Touge, Desert)
- 🔧 Customizable cars with upgrades
- 🎮 Keyboard and touch controls
- 🎵 **Procedural audio engine** with support for royalty-free music and SFX

## Audio System

The game features a hybrid audio system:

### Procedural Audio (Built-in)
- **Engine Sound**: Synthesized sawtooth wave with dynamic lowpass filter
- **Drift/Tire Screech**: Procedural noise-based effects
- **Turbo Boost**: Pitch-shifted synthesis
- **Collision**: Impact sound synthesis
- **Wind/Ambient**: Filtered noise with speed-based modulation

### Royalty-Free Music & SFX Support

The game supports adding royalty-free audio assets from:

1. **[OpenGameArt](https://opengameart.org/)** - Free game music and sounds
   - Search for: "racing", "car", "electronic", "drift"
   - Recommended licenses: CC0, CC-BY, CC-BY-SA

2. **[Freesound](https://freesound.org/)** - Community sound effects
   - Search for: "tire screech", "turbo", "collision", "wind"
   - Recommended licenses: CC0, CC-BY

3. **[Itch.io Game Assets](https://itch.io/game-assets/free/tag-sound-effects)** - Free game asset packs

#### How to Add Audio Assets

1. Download OGG/MP3 (music) or WAV/OGG (SFX) files
2. Place them in `/public/audio/` directory
3. Update the configuration in `/src/services/audioService.ts`:

```typescript
// Background Music by Theme
private MUSIC_TRACKS: Record<string, string> = {
  'neon_city': '/audio/music_neon_city.ogg',
  'touge': '/audio/music_touge.ogg',
  'desert': '/audio/music_desert.ogg',
};

// Sound Effects
private SFX_FILES: Record<string, string> = {
  'drift': '/audio/drift_sound.wav',
  'screech': '/audio/tire_screech.wav',
  'turbo': '/audio/turbo_boost.wav',
  'collision': '/audio/collision.wav',
  'wind': '/audio/wind_ambient.ogg',
};
```

See `/public/audio/AUDIO_ASSETS.md` for detailed instructions and recommended assets.

## Controls

| Action | Keyboard | Touch |
|--------|----------|-------|
| Accelerate | W / ↑ | Top of screen |
| Brake | S / ↓ | Bottom of screen |
| Left | A / ← | Left side |
| Right | D / → | Right side |
| Handbrake/Drift | Space | Drift button |

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
/workspace
├── src/
│   ├── components/     # React components
│   ├── game/           # Game engine components
│   ├── services/       # Audio and other services
│   ├── assets/         # Game assets
│   └── types.ts        # TypeScript types
├── public/
│   └── audio/          # Audio files (add your own here)
└── package.json
```

## License

This project is licensed under the Apache-2.0 License.

### Audio Asset Licenses

Audio assets added by users retain their original licenses:
- **CC0**: Public domain, no attribution required
- **CC-BY**: Attribution required
- **CC-BY-SA**: Attribution + ShareAlike required

Always check individual asset licenses and provide appropriate attribution.

## Credits

- Built with [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- Physics by [Cannon-es](https://github.com/pmndrs/cannon-es)
- UI Icons by [Lucide React](https://lucide.dev/)
