// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Available car models in the game.
 */
export type CarModelType = 'speedster' | 'drifter' | 'tank' | 'interceptor';

/**
 * Available track biomes/environments.
 */
export type BiomeType = 
  | 'neon_city' 
  | 'coastal_highway' 
  | 'desert_canyon' 
  | 'cyber_industrial' 
  | 'mountain_pass' 
  | 'urban_downtown';

/**
 * Available race modes.
 */
export type RaceMode = 
  | 'classic' 
  | 'time-trial' 
  | 'elimination' 
  | 'drift' 
  | 'tokyo-expressway';

/**
 * Spoiler options for car customization.
 */
export type SpoilerType = 'none' | 'small' | 'large';

/**
 * Decal options for car customization.
 */
export type DecalType = 'none' | 'stripes' | 'racing-number' | 'flames' | 'tribal';

/**
 * Body kit options for car customization.
 */
export type BodyKitType = 'stock' | 'street' | 'racing' | 'extreme';

/**
 * Configuration interface for player's car.
 */
export interface CarConfig {
  model: CarModelType;
  color: string;
  spoiler: SpoilerType;
  rims: string;
  decal: DecalType;
  bodyKit: BodyKitType;
  engine: number;
  tires: number;
  turbo: number;
}

/**
 * Player's inventory of performance parts.
 */
export interface Inventory {
  engines: number[];
  tires: number[];
  turbos: number[];
}

/**
 * Statistics for a car model.
 */
export interface CarStats {
  speed: number;
  accel: number;
  handling: number;
}

/**
 * Information about a car model.
 */
export interface CarModelInfo {
  name: string;
  description: string;
  stats: CarStats;
  glbUrl?: string;
}

/**
 * Information about a body kit.
 */
export interface BodyKitInfo {
  name: string;
  description: string;
}

/**
 * Information about a decal.
 */
export interface DecalInfo {
  name: string;
}

/**
 * Performance part configuration.
 */
export interface PerformancePart {
  level: number;
  name: string;
  price: number;
  boost?: number;
  grip?: number;
  accel?: number;
}

/**
 * Performance parts categorized by type.
 */
export interface PerformancePartsCatalog {
  engine: readonly PerformancePart[];
  tires: readonly PerformancePart[];
  turbo: readonly PerformancePart[];
}

// ============================================================================
// Constants and Configuration
// ============================================================================

/**
 * Available body kits with their descriptions.
 */
export const BODY_KITS: Record<BodyKitType, BodyKitInfo> = {
  stock: { name: 'Stock', description: 'Factory original body.' },
  street: { name: 'Street', description: 'Lowered suspension and side skirts.' },
  racing: { name: 'Racing', description: 'Wide body and aggressive front splitter.' },
  extreme: { name: 'Extreme', description: 'Full aero package with massive diffuser.' },
};

/**
 * Available decals with their names.
 */
export const DECALS: Record<DecalType, DecalInfo> = {
  none: { name: 'None' },
  stripes: { name: 'Racing Stripes' },
  'racing-number': { name: 'Pro Number' },
  flames: { name: 'Hot Flames' },
  tribal: { name: 'Tribal Art' },
};

/**
 * Performance parts catalog with stats and pricing.
 */
export const PERFORMANCE_PARTS: PerformancePartsCatalog = {
  engine: [
    { level: 1, name: 'Stock V6', price: 0, boost: 0 },
    { level: 2, name: 'Tuned V6', price: 2500, boost: 10 },
    { level: 3, name: 'V8 Swap', price: 6000, boost: 25 },
    { level: 4, name: 'Racing V8', price: 12000, boost: 45 },
    { level: 5, name: 'Hypercar V12', price: 25000, boost: 70 },
    { level: 6, name: 'Supercharged V12', price: 45000, boost: 100 },
    { level: 7, name: 'Electric Hybrid', price: 75000, boost: 140 },
    { level: 8, name: 'Rocket Engine', price: 120000, boost: 200 },
  ],
  tires: [
    { level: 1, name: 'Street Tires', price: 0, grip: 0 },
    { level: 2, name: 'Sport Tires', price: 1500, grip: 15 },
    { level: 3, name: 'Track Slicks', price: 4000, grip: 35 },
    { level: 4, name: 'Racing Slicks', price: 8500, grip: 60 },
    { level: 5, name: 'F1 Compounds', price: 18000, grip: 90 },
  ],
  turbo: [
    { level: 1, name: 'Naturally Aspirated', price: 0, accel: 0 },
    { level: 2, name: 'Street Turbo', price: 3000, accel: 15 },
    { level: 3, name: 'Twin Turbo', price: 7500, accel: 35 },
    { level: 4, name: 'Big Single Turbo', price: 15000, accel: 65 },
    { level: 5, name: 'Quad Turbo', price: 30000, accel: 100 },
  ],
} as const;

/**
 * Car models with their specifications.
 */
export const CAR_MODELS: Record<CarModelType, CarModelInfo> = {
  speedster: { 
    name: 'Speedster', 
    description: 'High top speed, lower handling.', 
    stats: { speed: 8, accel: 6, handling: 4 },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb'
  },
  drifter: { 
    name: 'Drifter', 
    description: 'Perfect for sliding through corners.', 
    stats: { speed: 6, accel: 7, handling: 8 },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'
  },
  tank: { 
    name: 'Tank', 
    description: 'Heavy and stable, but slow acceleration.', 
    stats: { speed: 5, accel: 4, handling: 9 },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb'
  },
  interceptor: { 
    name: 'Interceptor', 
    description: 'Balanced performance.', 
    stats: { speed: 7, accel: 7, handling: 7 },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sphere/glTF-Binary/Sphere.glb'
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Gets the default car configuration.
 */
export const getDefaultCarConfig = (): CarConfig => ({
  model: 'speedster',
  color: '#ffffff',
  spoiler: 'small',
  rims: 'silver',
  decal: 'none',
  bodyKit: 'stock',
  engine: 1,
  tires: 1,
  turbo: 1,
});

/**
 * Gets the default inventory.
 */
export const getDefaultInventory = (): Inventory => ({
  engines: [1],
  tires: [1],
  turbos: [1],
});

/**
 * Gets performance part by category and level.
 * @param category - The category of part (engine, tires, turbo)
 * @param level - The level of the part
 * @returns The performance part or undefined if not found
 */
export const getPerformancePart = (
  category: keyof PerformancePartsCatalog, 
  level: number
): PerformancePart | undefined => {
  return PERFORMANCE_PARTS[category].find(part => part.level === level);
};

/**
 * Calculates total boost from car configuration.
 * @param config - The car configuration
 * @returns Object containing total boost, grip, and acceleration values
 */
export const calculatePerformanceStats = (config: CarConfig) => {
  const enginePart = getPerformancePart('engine', config.engine);
  const tirePart = getPerformancePart('tires', config.tires);
  const turboPart = getPerformancePart('turbo', config.turbo);

  return {
    boost: enginePart?.boost ?? 0,
    grip: tirePart?.grip ?? 0,
    accel: turboPart?.accel ?? 0,
  };
};
