# Royalty-Free Audio Assets for Pro Star-Racing

This directory contains royalty-free music and sound effects for the game.

## Sources

### 1. OpenGameArt (https://opengameart.org/)
- **License**: Various (CC0, CC-BY, CC-BY-SA, GPL)
- **Search Terms**: "racing", "car", "engine", "drift", "electronic"

### 2. Freesound (https://freesound.org/)
- **License**: Various (CC0, CC-BY, Attribution)
- **Search Terms**: "tire screech", "turbo", "collision", "wind"

### 3. Itch.io Game Assets (https://itch.io/game-assets/free/tag-sound-effects)
- **License**: Varies by creator
- **Search Terms**: "racing sfx", "car sounds"

## How to Add New Audio

### Music Tracks
1. Download OGG or MP3 files from royalty-free sources
2. Place in this `/public/audio/` directory
3. Update `MUSIC_TRACKS` in `/src/services/audioService.ts`:
   ```typescript
   private MUSIC_TRACKS: Record<string, string> = {
     'neon_city': '/audio/music_neon_city.ogg',
     'touge': '/audio/music_touge.ogg',
     'desert': '/audio/music_desert.ogg',
   };
   ```

### Sound Effects
1. Download WAV or OGG files from royalty-free sources
2. Place in this `/public/audio/` directory
3. Update `SFX_FILES` in `/src/services/audioService.ts`:
   ```typescript
   private SFX_FILES: Record<string, string> = {
     'drift': '/audio/drift_sound.wav',
     'screech': '/audio/tire_screech.wav',
     'turbo': '/audio/turbo_boost.wav',
     'collision': '/audio/collision.wav',
     'wind': '/audio/wind_ambient.ogg',
   };
   ```

## Recommended Assets

### Background Music
| Track | Source | License | Theme |
|-------|--------|---------|-------|
| Cyberpunk Racing | OpenGameArt | CC-BY | neon_city |
| Mountain Pass | OpenGameArt | CC0 | touge |
| Desert Highway | OpenGameArt | CC-BY | desert |

### Sound Effects
| Effect | Source | License |
|--------|--------|---------|
| Tire Screech | Freesound | CC0 |
| Turbo Boost | Freesound | CC-BY |
| Collision | Freesound | CC0 |
| Wind Ambient | Freesound | CC0 |

## Attribution

If using CC-BY licensed assets, add attribution below:

```
## Audio Credits
- "Track Name" by Artist Name from OpenGameArt.org (CC-BY 3.0)
- "SFX Name" by Artist Name from Freesound.org (CC0)
```

## Current Status

As of now, the game uses **procedural audio generation** for all sounds:
- Engine: Synthesized sawtooth wave with lowpass filter
- Drift/Screech: Procedural noise-based effects
- Turbo: Synthesized pitch-shifted sounds
- Collision: Impact synthesis
- Wind: Filtered noise

To enhance the experience, download and add real audio files following the instructions above.
