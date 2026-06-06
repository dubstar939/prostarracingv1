/**
 * Central game configuration - tune difficulty, physics, and themes here.
 */

export const GAME_CONFIG = {
  // Physics
  physics: {
    baseMaxSpeed: 15000,
    baseAccelDivisor: 4,         // maxSpeed / divisor = baseAccel
    brakeMultiplier: 2.5,        // maxSpeed * multiplier
    decelDivisor: 4,             // maxSpeed / divisor = natural decel
    offRoadDecelDivisor: 1.5,
    offRoadSpeedLimitDivisor: 3,
    engineBoostPerLevel: 150,    // extra speed per engine level
    turboAccelPerLevel: 100,
    turboBoostAccel: 15000,
    turboMaxSpeed: 18000,
    turboChargeRate: 25,         // % per second
    turboBoostDuration: 3,       // seconds
  },

  // Difficulty scaling per level
  difficulty: {
    opponentBaseSpeed: 7500,
    opponentSpeedPerLevel: 400,
    opponentRubberband: 0.15,     // fraction of speed for rubberbanding
    collisionDamageBase: 0.5,
    collisionDamagePerLevel: 0.2,
    checkpointBaseTime: 40,       // seconds
    checkpointExtension: 30,
  },

  // Road / track
  road: {
    width: 2000,
    carWidth: 400,
    segmentLength: 200,
    rumbleLength: 3,
    fieldOfView: 100,
    cameraHeight: 1000,
    drawDistance: 300,
  },

  // Rendering
  rendering: {
    screenWidth16x9: 1066,
    screenWidth4x3: 800,
    screenHeight: 600,
  },

  // Scoring
  scoring: {
    driftIntensityMultiplier: 100,  // per second of drift
    nearMissBonus: 50,
    firstPlaceBonus: 500,
    positionReward: 200,            // * (10 - position)
    driftScoreToCash: 10,           // divisor
  },
};

export type DifficultyLevel = 'easy' | 'normal' | 'hard';

export const DIFFICULTY_PRESETS: Record<DifficultyLevel, {
  opponentSpeedMult: number;
  damageMultiplier: number;
  checkpointTimeMult: number;
  label: string;
  description: string;
}> = {
  easy: {
    opponentSpeedMult: 0.75,
    damageMultiplier: 0.5,
    checkpointTimeMult: 1.5,
    label: 'Easy',
    description: 'Relaxed pace, forgiving checkpoints.',
  },
  normal: {
    opponentSpeedMult: 1.0,
    damageMultiplier: 1.0,
    checkpointTimeMult: 1.0,
    label: 'Normal',
    description: 'Balanced challenge.',
  },
  hard: {
    opponentSpeedMult: 1.3,
    damageMultiplier: 1.5,
    checkpointTimeMult: 0.7,
    label: 'Hard',
    description: 'Aggressive AI, tight checkpoints.',
  },
};
