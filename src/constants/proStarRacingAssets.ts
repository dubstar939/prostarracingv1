/**
 * PRO STAR-RACING - ASSET PRODUCTION SPECIFICATIONS
 * Style: Grounded 90s–2000s Japan Tuner Aesthetic
 * NO neon, NO futuristic, NO cyberpunk elements
 */

// ============================================================================
// ROLE 1 — GAME ARTISTS: 2D CAR SPRITE SPECIFICATIONS
// ============================================================================

export const CAR_SPRITE_SPEC = {
  // Directory: prostarracingv1/src/assets/cars/
  output_directory: "src/assets/cars/",
  
  // Canvas specifications
  canvas_size: { width: 256, height: 128 },
  background: "transparent",
  anchor_point: { x: 128, y: 96 }, // Bottom-center for road alignment
  
  // Pixel-art constraints
  pixel_art_style: {
    resolution: "Semi-pixel art (not pure 8-bit)",
    shading_direction: "Top-left light source (10 o'clock)",
    palette_limit: "32 colors maximum per sprite",
    outline: "1px dark gray (#2d2d2d), NO black outlines",
    anti_aliasing: "Manual AA only on curves, no auto-smoothing"
  },
  
  // Color palette (grounded JDM street-racing)
  palette: {
    // Body colors (metallic finishes)
    body_red: "#c41e3a",        // Monza Red
    body_blue: "#1e3a8a",       // Lightning Yellow (dark blue variant)
    body_silver: "#c0c0c0",     // Sonic Silver
    body_black: "#1a1a1a",      // Crystal Black
    body_white: "#f5f5f5",      // Championship White
    body_green: "#2d5016",      // British Racing Green
    body_orange: "#d97706",     // Sunset Orange
    body_purple: "#4c1d95",     // Deep Violet
    
    // Environmental tones
    asphalt_dark: "#2d3748",
    asphalt_light: "#4a5568",
    grass: "#38a169",
    sky_blue: "#63b3ed",
    concrete: "#a0aec0",
    
    // Highlights and shadows
    highlight: "rgba(255, 255, 255, 0.4)",
    shadow: "rgba(0, 0, 0, 0.3)",
    rim_light: "rgba(255, 255, 255, 0.2)"
  },
  
  // Car model sprite sheets
  models: {
    speedster: {
      filename: "speedster_spritesheet.png",
      description: "High-top-speed coupe with long hood, short deck. Inspired by Silvia S15.",
      dimensions: { length: 180, height: 52, width: 64 },
      frames: {
        idle: { count: 4, fps: 8, loop: true },
        driving: { count: 8, fps: 12, loop: true },
        braking: { count: 3, fps: 10, loop: false },
        turning_left: { count: 6, fps: 10, loop: true },
        turning_right: { count: 6, fps: 10, loop: true },
        drifting: { count: 12, fps: 15, loop: true, notes: "Tire smoke particles separate" }
      },
      key_features: [
        "Aggressive front bumper with large air intake",
        "Pop-up headlights (optional variant)",
        "Rear spoiler mount points visible",
        "Side skirts with subtle vent details",
        "Exhaust tip glowing orange when accelerating"
      ]
    },
    
    drifter: {
      filename: "drifter_spritesheet.png",
      description: "Lightweight RWD coupe optimized for corner exit speed. Inspired by AE86.",
      dimensions: { length: 168, height: 48, width: 60 },
      frames: {
        idle: { count: 4, fps: 8, loop: true },
        driving: { count: 8, fps: 12, loop: true },
        braking: { count: 3, fps: 10, loop: false },
        turning_left: { count: 6, fps: 10, loop: true },
        turning_right: { count: 6, fps: 10, loop: true },
        drifting: { count: 16, fps: 18, loop: true, notes: "Extended drift sequence with heavy smoke" }
      },
      key_features: [
        "Round pop-up headlights (signature feature)",
        "Boxy 80s silhouette with clean lines",
        "Black lower trim accent",
        "Simple steel wheels or aftermarket alloys",
        "Visible suspension components in wheel wells"
      ]
    },
    
    tank: {
      filename: "tank_spritesheet.png",
      description: "Heavy luxury coupe with stable high-speed presence. Inspired by Skyline R32.",
      dimensions: { length: 192, height: 56, width: 68 },
      frames: {
        idle: { count: 4, fps: 8, loop: true },
        driving: { count: 8, fps: 12, loop: true },
        braking: { count: 4, fps: 10, loop: false, notes: "Longer brake animation (heavy vehicle)" },
        turning_left: { count: 6, fps: 10, loop: true },
        turning_right: { count: 6, fps: 10, loop: true },
        drifting: { count: 10, fps: 12, loop: true, notes: "Stable drift, less body roll" }
      },
      key_features: [
        "Quad round taillights (signature feature)",
        "Wide fender flares (stock or over-fender kit)",
        "Boxy 90s sedan proportions",
        "Twin exhaust tips",
        "Subtle hood vents for engine cooling"
      ]
    },
    
    interceptor: {
      filename: "interceptor_spritesheet.png",
      description: "Balanced sports coupe with all-around performance. Inspired by RX-7 FD.",
      dimensions: { length: 176, height: 50, width: 62 },
      frames: {
        idle: { count: 4, fps: 8, loop: true },
        driving: { count: 8, fps: 12, loop: true },
        braking: { count: 3, fps: 10, loop: false },
        turning_left: { count: 6, fps: 10, loop: true },
        turning_right: { count: 6, fps: 10, loop: true },
        drifting: { count: 14, fps: 16, loop: true, notes: "Smooth transition into drift" }
      },
      key_features: [
        "Curvy organic body lines (no sharp edges)",
        "Pop-up headlight design (closed position shown)",
        "Large side air intakes behind doors",
        "Integrated rear ducktail spoiler",
        "Rotary engine glow effect (subtle orange under hood)"
      ]
    }
  },
  
  // Animation breakdown template
  animation_template: {
    frame_count_example: "8 frames for driving cycle",
    timing_example: "12 FPS = 0.083s per frame, 0.667s full cycle",
    motion_arcs: [
      "Wheel rotation: 45° per frame (synchronized with road scroll)",
      "Body bounce: ±2 pixels vertical (sinusoidal interpolation)",
      "Exhaust glow: Frame 1-2 bright, Frame 3-8 dim (pulsing pattern)",
      "Driver head movement: Subtle ±1 pixel following turn direction"
    ],
    file_naming: "{model}_{animation}_{frame_number}.png (e.g., speedster_driving_03.png)"
  },
  
  // Customization variants
  customization_layers: {
    spoilers: {
      none: "No rear wing (stock trunk lid)",
      small: "Low-profile lip spoiler (OEM+ style)",
      large: "GT wing with adjustable angle (racing style)"
    },
    body_kits: {
      stock: "Factory bumpers and side skirts",
      street: "Lowered suspension + subtle lip kit",
      racing: "Wide-body fenders + aggressive splitter",
      extreme: "Full aero package + vented hood + diffuser"
    },
    decals: {
      none: "Clean paint",
      stripes: "Dual racing stripes (center or offset)",
      racing_number: "Competition number on doors (white circle background)",
      flames: "Traditional hot rod flames from front wheel arch",
      tribal: "Late 90s tribal graphics along rocker panels"
    },
    rims: {
      silver: "5-spoke silver alloys",
      black: "Matte black mesh wheels",
      chrome: "Polished deep-dish rims",
      gold: "Rally gold cross-spoke wheels"
    }
  }
};

// ============================================================================
// ROLE 2 — AUDIO DESIGNERS: SOUND SPECIFICATIONS
// ============================================================================

export const AUDIO_SPEC = {
  // Directory: prostarracingv1/src/assets/audio/
  output_directory: "src/assets/audio/",
  
  // Audio format requirements
  format: {
    sfx: "WAV, 44.1kHz, 16-bit mono",
    music: "OGG, 44.1kHz, stereo, ~128kbps",
    mobile_optimization: "Include .mp3 fallback for iOS compatibility"
  },
  
  // Engine sounds (grounded, mechanical, non-synth)
  engine_sounds: {
    speedster_v6: {
      filename: "engine_speedster_idle.wav",
      description: "Naturally aspirated V6, mid-range focused",
      layers: [
        "Base idle rumble (80-120Hz fundamental)",
        "Intake whistle layer (high-pass filtered at 2kHz)",
        "Exhaust burble on deceleration",
        "Mechanical valvetrain rattle (subtle, 5% mix)"
      ],
      rpm_variants: ["idle.wav", "low_rpm.wav", "mid_rpm.wav", "high_rpm.wav", "redline.wav"],
      crossfade_points: "Smooth 200ms crossfade between RPM layers"
    },
    
    drifter_i4: {
      filename: "engine_drifter_idle.wav",
      description: "High-revving inline-4, cammed intake note",
      layers: [
        "Sharp idle crackle (100-150Hz fundamental)",
        "Individual throttle body scream",
        "Turbo flutter on lift-off (wastegate variant)",
        "Timing belt whine (subtle, 3% mix)"
      ],
      rpm_variants: ["idle.wav", "low_rpm.wav", "mid_rpm.wav", "high_rpm.wav", "redline.wav"],
      special_notes: "Emphasize cam lobe separation for choppy idle character"
    },
    
    tank_rb6: {
      filename: "engine_tank_idle.wav",
      description: "Twin-turbo inline-6, smooth power delivery",
      layers: [
        "Deep authoritative idle (70-100Hz fundamental)",
        "Sequential turbo spool whistle",
        "Intercooler piping resonance",
        "Exhaust drone suppression (notch filter at 180Hz)"
      ],
      rpm_variants: ["idle.wav", "low_rpm.wav", "mid_rpm.wav", "high_rpm.wav", "redline.wav"],
      special_notes: "Maintain smoothness; this is a luxury GT engine"
    },
    
    interceptor_rotary: {
      filename: "engine_interceptor_idle.wav",
      description: "Twin-rotor Wankel, unique high-pitched scream",
      layers: [
        "Distinctive rotary bark (200-300Hz unusual harmonic)",
        "Apex seal whisper (mechanical texture)",
        "Intake trumpet howl",
        "Periphery port opening sound (mid-RPM transition)"
      ],
      rpm_variants: ["idle.wav", "low_rpm.wav", "mid_rpm.wav", "high_rpm.wav", "redline.wav"],
      special_notes: "This should sound ALIEN compared to piston engines"
    }
  },
  
  // UI sounds (soft clicks, mechanical toggles, subtle whooshes)
  ui_sounds: {
    menu_select: {
      filename: "ui_select.wav",
      description: "Satisfying mechanical click with slight reverb",
      duration_ms: 150,
      frequency_range: "800Hz-2kHz (cut through music)"
    },
    menu_confirm: {
      filename: "ui_confirm.wav",
      description: "Deeper positive confirmation tone",
      duration_ms: 200,
      frequency_range: "400Hz-1.5kHz"
    },
    menu_back: {
      filename: "ui_back.wav",
      description: "Quick negative feedback, softer than confirm",
      duration_ms: 120,
      frequency_range: "600Hz-1.8kHz"
    },
    garage_rotation: {
      filename: "ui_rotate.wav",
      description: "Motorized turntable whoosh",
      duration_ms: 800,
      frequency_range: "200Hz-800Hz (low-mid presence)"
    },
    purchase_success: {
      filename: "ui_purchase.wav",
      description: "Ascending coin/chime progression",
      duration_ms: 600,
      frequency_range: "1kHz-4kHz (bright and celebratory)"
    },
    purchase_error: {
      filename: "ui_error.wav",
      description: "Descending rejection tone",
      duration_ms: 400,
      frequency_range: "300Hz-1kHz (muted, not harsh)"
    }
  },
  
  // Racing SFX
  racing_sfx: {
    tire_screech: {
      filename: "tire_screech.wav",
      description: "Rubber friction during hard cornering/drift initiation",
      layers: [
        "Initial bite transient (sharp attack)",
        "Sustained slide tone (pitch varies with slip angle)",
        "Particle texture (road debris interaction)"
      ],
      velocity_modulation: "Pitch +0 to +12 semitones based on lateral G-force"
    },
    
    tire_roll: {
      filename: "tire_roll.wav",
      description: "Ambient tire noise on various surfaces",
      surface_variants: [
        "asphalt_smooth.wav (baseline)",
        "asphalt_rough.wav (+3dB high-frequency content)",
        "concrete.wav (hollow resonance at 150Hz)",
        "gravel.wav (added particle layer)"
      ]
    },
    
    wind_rush: {
      filename: "wind_rush.wav",
      description: "Aerodynamic noise increasing with speed",
      layers: [
        "Baseline wind hiss (constant)",
        "A-pillar turbulence (modulated by steering input)",
        "Mirror whistle (high-speed only, >150km/h)"
      ],
      velocity_curve: "Amplitude scales with speed²"
    },
    
    collision_impact: {
      filename: "collision_metal.wav",
      description: "Metal-on-metal impact with barrier/wall",
      layers: [
        "Primary impact transient (short, punchy)",
        "Panel vibration decay (ringing at 80-120Hz)",
        "Plastic crunch (for bumper contacts)",
        "Glass rattle (for severe impacts)"
      ],
      intensity_variants: ["light.wav", "medium.wav", "heavy.wav"]
    },
    
    countdown: {
      filename: "countdown_3.wav",
      description: "Race start countdown beeps",
      variants: [
        "countdown_3.wav (higher pitch)",
        "countdown_2.wav (slightly higher)",
        "countdown_1.wav (even higher)",
        "countdown_go.wav (two-tone ascending)"
      ],
      frequency: "2kHz sine wave with 50ms envelope"
    }
  },
  
  // Music specifications (royalty-free only)
  music_tracks: {
    menu_theme: {
      filename: "music_menu.ogg",
      mood: "Laid-back, confident, urban cruising",
      instrumentation: [
        "Electric guitar (clean, chorus effect)",
        "Fretless bass (smooth slides)",
        "Drum machine (808-style, half-time groove)",
        "Analog synth pad (warm, no leads)"
      ],
      tempo_bpm: 85,
      structure: "Intro (8 bars) → Loop A (16 bars) → Loop B (16 bars) → Outro (8 bars)",
      duration_seconds: 120,
      royalty_free_sources: [
        "OpenGameArt.org (CC-BY license)",
        "Incompetech.com (Kevin MacLeod, CC-BY)",
        "FreeMusicArchive.org (check commercial use)"
      ]
    },
    
    race_neutral: {
      filename: "music_race_neutral.ogg",
      mood: "Energetic, percussive, non-vocal",
      instrumentation: [
        "Live drums (breakbeat patterns)",
        "Electric bass (driving eighth notes)",
        "Rhythm guitar (palm-muted chugging)",
        "Brass stabs (occasional accents)"
      ],
      tempo_bpm: 140,
      structure: "Build-up (4 bars) → Main loop (32 bars) → Breakdown (8 bars) → Main loop",
      duration_seconds: 180,
      dynamic_mixing: "Reduce drum volume by -6dB during countdown"
    },
    
    race_coastal: {
      filename: "music_race_coastal.ogg",
      mood: "Sunset drive, nostalgic, warm",
      instrumentation: [
        "Surf guitar (spring reverb)",
        "Organ (Hammond-style)",
        "Congas/percussion (beach vibe)",
        "Synth bass (Moog-style, warm)"
      ],
      tempo_bpm: 120,
      reference_style: "City pop instrumental, 1980s Japanese fusion"
    },
    
    race_mountain: {
      filename: "music_race_mountain.ogg",
      mood: "Tense, focused, technical",
      instrumentation: [
        "Minimal percussion (taiko drums)",
        "Shakuhachi flute samples (sparse)",
        "Deep sub-bass drones",
        "Koto plucks (rhythmic accents)"
      ],
      tempo_bpm: 100,
      reference_style: "Touge battle atmosphere, traditional meets modern"
    },
    
    victory_theme: {
      filename: "music_victory.ogg",
      mood: "Triumphant, celebratory, brief",
      instrumentation: [
        "Brass fanfare (trumpets, trombones)",
        "Snare drum rolls",
        "Cymbal crashes",
        "Major key progression (I-V-vi-IV)"
      ],
      tempo_bpm: 130,
      duration_seconds: 30,
      usage: "Play during results screen, loop once max"
    }
  },
  
  // Mixing guidelines for mobile performance
  mixing_guidelines: {
    master_bus: {
      limiter_threshold_db: -3,
      target_loudness_lufs: -14,
      sample_rate: "44.1kHz",
      bit_depth: "16-bit"
    },
    
    channel_groups: {
      engines: { bus_db: -6, eq_high_shelf: "+2dB at 5kHz" },
      tires: { bus_db: -12, eq_low_cut: "100Hz HPF" },
      ui: { bus_db: -3, compression: "4:1 ratio, fast attack" },
      music: { bus_db: -9, sidechain: "Duck -3dB when engine redlines" },
      sfx: { bus_db: -6, spatial: "Stereo width 60%" }
    },
    
    mobile_optimizations: [
      "Use mono sources for engine/tire sounds (save processing)",
      "Limit simultaneous voices to 16 (priority-based culling)",
      "Pre-render complex reverbs to impulse responses",
      "Implement LOD audio: reduce quality beyond 50m distance",
      "Use PCM streaming for music, keep SFX in memory"
    ]
  }
};

// ============================================================================
// ROLE 3 — UI/UX ARTISTS: INTERFACE SPECIFICATIONS
// ============================================================================

export const UI_UX_SPEC = {
  // Design philosophy
  philosophy: {
    aesthetic: "Grounded 90s–2000s Japan Tuner culture",
    inspiration: [
      "Gran Turismo 1-4 menu systems",
      "Initial D arcade cabinet interfaces",
      "Car magazine layouts (Option, Hyper Rev)",
      "Dyno tuning software interfaces"
    ],
    forbidden_elements: [
      "NO neon glows or bloom effects",
      "NO holographic/futuristic elements",
      "NO cyberpunk color schemes (cyan/magenta overload)",
      "NO sci-fi fonts or digital displays",
      "NO placeholder rectangles without defined content"
    ]
  },
  
  // Color palettes (grounded JDM racing themes)
  color_palettes: {
    primary: {
      asphalt_dark: "#1a1a2e",
      asphalt_light: "#2d3748",
      carbon_fiber: "#0d0d0d",
      brushed_aluminum: "#a0aec0",
      checkered_flag: "#ffffff"
    },
    
    accent: {
      racing_red: "#c41e3a",
      warning_yellow: "#fbbf24",
      success_green: "#38a169",
      info_blue: "#3182ce",
      disabled_gray: "#718096"
    },
    
    text: {
      primary: "#ffffff",
      secondary: "#cbd5e0",
      muted: "#a0aec0",
      inverse: "#1a202c"
    }
  },
  
  // Typography
  typography: {
    headings: {
      font_family: "'Teko', 'Oswald', sans-serif (condensed bold)",
      weights: [600, 700],
      sizes: {
        title_xl: "48px",
        section_lg: "32px",
        subsection_md: "24px",
        label_sm: "18px"
      },
      letter_spacing: "0.05em",
      text_transform: "uppercase"
    },
    
    body: {
      font_family: "'Roboto', 'Open Sans', sans-serif",
      weights: [400, 500],
      sizes: {
        paragraph: "16px",
        caption: "14px",
        button: "16px"
      },
      line_height: 1.5
    },
    
    numbers: {
      font_family: "'Share Tech Mono', monospace",
      usage: "Speed readouts, timers, currency values",
      tabular_nums: true
    }
  },
  
  // Wireframe descriptions (text-only, no mockups)
  screens: {
    title_screen: {
      layout: "Full-viewport hero image with centered logo overlay",
      elements: [
        { id: "background", type: "image", description: "Dynamic scene of Touge mountain pass at dawn, one car silhouette in distance" },
        { id: "logo", type: "text+graphic", description: "PRO STAR-RACING wordmark with stylized star icon, positioned center-top 20%", size: "64px" },
        { id: "tagline", type: "text", description: "'Street Racing Legends' subtitle below logo, italic, 20px" },
        { id: "start_prompt", type: "animated_text", description: "'PRESS START' blinking at 1Hz, center-bottom 30%, 28px" },
        { id: "copyright", type: "text", description: "Small copyright notice bottom-right, 12px, muted color" }
      ],
      interaction_flow: "Any key press → fade to main menu (300ms)"
    },
    
    main_menu: {
      layout: "Split-screen: left 40% navigation, right 60% preview window",
      elements: [
        { id: "nav_container", type: "vertical_list", description: "Left panel with stacked buttons", items: [
          { label: "GARAGE", icon: "wrench", action: "navigate_garage" },
          { label: "QUICK RACE", icon: "flag", action: "navigate_race_select" },
          { label: "STORE", icon: "shopping_bag", action: "navigate_store" },
          { label: "OPTIONS", icon: "settings", action: "navigate_options" }
        ]},
        { id: "preview_window", type: "3d_canvas", description: "Right panel showing rotating 3D car model, user's current garage car" },
        { id: "player_stats", type: "info_panel", description: "Bottom-left corner: Credits display, total wins, favorite track" }
      ],
      interaction_flow: "Button hover → highlight + subtle scale (1.05); Button click → confirm SFX + page transition"
    },
    
    garage: {
      layout: "Three-column layout: parts list (left 25%), car preview (center 50%), stats panel (right 25%)",
      elements: [
        { id: "parts_categories", type: "tabbed_navigation", description: "Left column tabs: ENGINE, TIRES, TURBO, BODY, PAINT, DECALS" },
        { id: "parts_list", type: "scrollable_list", description: "Below active tab: available parts with price/install status indicators" },
        { id: "car_preview", type: "interactive_3d", description: "Center: rotatable car model (drag to rotate, scroll to zoom), real-time part visualization" },
        { id: "rotation_controls", type: "button_group", description: "Below preview: [← Rotate] [Reset] [Rotate →]" },
        { id: "stats_radars", type: "chart", description: "Right column top: 3-axis radar chart (Speed, Acceleration, Handling) comparing stock vs current" },
        { id: "dyno_graph", type: "chart", description: "Right column middle: Power curve graph (HP vs RPM), torque overlay" },
        { id: "cost_summary", type: "info_panel", description: "Right column bottom: Total upgrade cost, INSTALL button (disabled if insufficient funds)" }
      ],
      interaction_flow: "Select part → preview updates instantly; Hover part → tooltip with specs; Click INSTALL → confirmation modal → deduct credits → apply changes"
    },
    
    race_select: {
      layout: "Grid-based track selector with biome thumbnails",
      elements: [
        { id: "biome_tabs", type: "horizontal_tabs", description: "Top row: MOUNTAIN | COASTAL | DESERT | URBAN" },
        { id: "track_grid", type: "card_grid", description: "2x3 grid of track cards within selected biome", card_structure: [
          { thumbnail: "Top-down mini-map preview" },
          { track_name: "Bold text, e.g., 'Mt. Akina Infield'" },
          { distance: "Track length in km" },
          { difficulty: "1-5 star rating" },
          { record_time: "Player's best time or '--:--.--'" }
        ]},
        { id: "mode_selector", type: "dropdown", description: "Bottom-left: Race mode (Classic, Time Trial, Drift Battle)" },
        { id: "start_race_btn", type: "primary_button", description: "Bottom-right: Large 'START RACE' button, disabled until track selected" }
      ],
      interaction_flow: "Click biome tab → filter tracks; Click track card → highlight border; Click START → loading screen with track info"
    },
    
    hud_race: {
      layout: "Minimalist overlay, critical info only, no clutter",
      elements: [
        { id: "speedometer", type: "gauge", description: "Bottom-right quadrant: Analog-style tachometer with digital speed readout inside, shift lights at redline" },
        { id: "position_indicator", type: "badge", description: "Top-left: 'POS 1/4' with up/down arrow if position changed last lap" },
        { id: "lap_timer", type: "digital_display", description: "Top-center: Current lap time '1:23.456', best lap below in smaller text" },
        { id: "mini_map", type: "radar", description: "Top-right: Simplified track outline with player dot and opponent dots, no terrain detail" },
        { id: "gear_indicator", type: "numeric", description: "Inside speedometer: Current gear '5' or 'N'/'R'" },
        { id: "damage_warning", type: "icon", description: "Flashes red when car takes significant damage, shows wrench icon" }
      ],
      visibility_rules: "All elements have semi-transparent dark backgrounds (#000000 60% opacity); Auto-hide mini-map after 5s no input, show on steer"
    },
    
    results_screen: {
      layout: "Centered modal overlay on blurred race screenshot",
      elements: [
        { id: "position_banner", type: "large_text", description: "Top: '1st PLACE' or '2nd PLACE' etc., color-coded (gold/silver/bronze/gray)" },
        { id: "time_summary", type: "data_table", description: "Center-left: Race time, Best lap, Average speed, Top speed achieved" },
        { id: "rewards_panel", type: "info_box", description: "Center-right: Credits earned, XP gained, new parts unlocked (if any)" },
        { id: "replay_controls", type: "button_group", description: "Below data: [WATCH REPLAY] [SAVE GHOST] (ghost saving for time trial only)" },
        { id: "continue_btn", type: "primary_button", description: "Bottom-center: 'CONTINUE' returns to main menu" }
      ],
      interaction_flow: "Screen appears 2s after race end (skip button available); Click CONTINUE → fade out → main menu"
    },
    
    store: {
      layout: "Shop interface with category sidebar and product grid",
      elements: [
        { id: "category_sidebar", type: "vertical_nav", description: "Left 20%: PERFORMANCE, VISUAL, MERCHANDISE categories" },
        { id: "product_grid", type: "card_layout", description: "Center 60%: 3-column grid of product cards", card_structure: [
          { product_image: "Part photo or icon" },
          { product_name: "e.g., 'Stage 3 Turbo Kit'" },
          { compatibility: "Fits: SPEEDSTER, DRIFTER" },
          { price: "¥25,000 with currency icon" },
          { owned_badge: "'OWNED' overlay if purchased" }
        ]},
        { id: "cart_panel", type: "summary_box", description: "Right 20%: Selected item details, total cost, BUY NOW button" },
        { id: "credits_display", type: "persistent_header", description: "Top-right always visible: Current credit balance" }
      ],
      interaction_flow: "Click product → populate cart panel; Click BUY NOW → confirmation modal → deduct credits → mark as owned"
    }
  },
  
  // Interaction patterns
  interaction_patterns: {
    button_states: {
      default: "Solid background, 100% opacity",
      hover: "Background lightens 10%, scale 1.02, 150ms transition",
      active: "Background darkens 10%, scale 0.98, instant",
      disabled: "50% opacity, cursor not-allowed, no hover effects"
    },
    
    transitions: {
      page_enter: "Slide from right 20px + fade in, 250ms ease-out",
      page_exit: "Slide to left 20px + fade out, 200ms ease-in",
      modal_open: "Scale from 0.9 to 1.0 + fade, 200ms cubic-bezier",
      modal_close: "Reverse of open, 150ms"
    },
    
    feedback: {
      success: "Green flash border (2px #38a169) + confirm SFX",
      error: "Red shake animation (±3px, 3 cycles) + error SFX",
      loading: "Spinner icon (carbon fiber texture) + progress percentage"
    }
  },
  
  // Mobile-first responsive breakpoints
  responsive_breakpoints: {
    mobile_portrait: {
      max_width: "480px",
      layout_changes: [
        "Single-column layout for all screens",
        "Garage: Stack parts list above preview, preview above stats",
        "Hud: Minimal mode only (speed + position), hide mini-map",
        "Buttons: Full-width, min-height 48px for touch targets"
      ]
    },
    mobile_landscape: {
      min_width: "481px",
      max_width: "768px",
      layout_changes: [
        "Two-column layouts enabled",
        "Preview windows reduced to 40% width",
        "Font sizes scale down 10%"
      ]
    },
    tablet_desktop: {
      min_width: "769px",
      layout_changes: [
        "Full three-column layouts active",
        "Hover states enabled (not touch-only)",
        "Additional info panels visible (dyno, detailed stats)"
      ]
    }
  },
  
  // Accessibility considerations
  accessibility: {
    color_blind_modes: [
      "Deuteranopia (red-green): Replace red/green with blue/orange",
      "Protanopia (red-blind): Increase contrast, add symbols to colors",
      "Tritanopia (blue-yellow): Use teal/brown替代"
    ],
    text_scaling: "Support 100%-200% system font scaling without layout break",
    motion_reduction: "Respect prefers-reduced-motion: disable camera shake, minimize transitions",
    screen_reader: "All interactive elements have aria-labels; race HUD announces position changes"
  }
};

// ============================================================================
// FILE NAMING CONVENTIONS (Compatible with prostarracingv1/src/assets/)
// ============================================================================

export const FILE_NAMING_CONVENTIONS = {
  car_sprites: "{model}_{variant}_{view}_{frame}.png",
  examples: [
    "speedster_stock_side_01.png",
    "drifter_widebody_front_05.png",
    "tank_racing_rear_12.png",
    "interceptor_extreme_top_03.png"
  ],
  
  audio_sfx: "sfx_{category}_{specific}_{variant}.wav",
  examples: [
    "sfx_engine_speedster_idle.wav",
    "sfx_tire_screech_heavy.wav",
    "sfx_ui_select_confirm.wav",
    "sfx_collision_metal_medium.wav"
  ],
  
  audio_music: "music_{context}_{biome}_{version}.ogg",
  examples: [
    "music_menu_main_v1.ogg",
    "music_race_coastal_loop.ogg",
    "music_race_mountain_intense.ogg",
    "music_victory_short.ogg"
  ],
  
  ui_textures: "ui_{screen}_{element}_{state}.png",
  examples: [
    "ui_garage_tab_active.png",
    "ui_button_primary_hover.png",
    "ui_icon_wrench_large.png",
    "ui_background_carbon_tile.png"
  ]
};

// Export all specifications
export default {
  CAR_SPRITE_SPEC,
  AUDIO_SPEC,
  UI_UX_SPEC,
  FILE_NAMING_CONVENTIONS
};
