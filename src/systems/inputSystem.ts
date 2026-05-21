/**
 * Advanced Input System
 * Handles smooth input buffering and control smoothing for realistic feel
 */

export interface InputState {
  steerTarget: number;      // Target steering input (-1 to 1)
  steerCurrent: number;     // Actual steering (smoothed)
  accelTarget: number;      // Target acceleration input (0 to 1)
  accelCurrent: number;     // Actual acceleration (smoothed)
  brakeTarget: number;      // Target braking input (0 to 1)
  brakeCurrent: number;     // Actual braking (smoothed)
}

/**
 * Creates initial input state
 */
export const createInputState = (): InputState => ({
  steerTarget: 0,
  steerCurrent: 0,
  accelTarget: 0,
  accelCurrent: 0,
  brakeTarget: 0,
  brakeCurrent: 0
});

/**
 * Updates input state with smoothing (input buffering)
 * Creates responsive but smooth controls
 * @param input - Current input state
 * @param dt - Delta time in seconds
 * @param responseTime - Time to reach target input (in seconds)
 * @returns Updated input state
 */
export const updateInputSmoothing = (
  input: InputState,
  dt: number,
  responseTime: number = 0.12 // 120ms response time for realistic feel
): InputState => {
  // Exponential smoothing factor
  const alpha = dt / (responseTime + dt);
  
  return {
    ...input,
    steerCurrent: input.steerCurrent + (input.steerTarget - input.steerCurrent) * alpha,
    accelCurrent: input.accelCurrent + (input.accelTarget - input.accelCurrent) * alpha,
    brakeCurrent: input.brakeCurrent + (input.brakeTarget - input.brakeCurrent) * alpha,
  };
};

/**
 * Applies deadzone to analog inputs
 * @param input - Raw input value (-1 to 1)
 * @param deadzone - Deadzone threshold (0-1)
 * @returns Deadzone-applied value
 */
export const applyDeadzone = (input: number, deadzone: number = 0.15): number => {
  if (Math.abs(input) < deadzone) return 0;
  
  const sign = Math.sign(input);
  const magnitude = (Math.abs(input) - deadzone) / (1 - deadzone);
  return sign * magnitude;
};

/**
 * Calculates steering angle based on speed
 * Higher speeds = less steering angle (realistic)
 * @param speedPercent - Speed as percentage of max (0-1)
 * @param steeringInput - Raw steering input (-1 to 1)
 * @returns Effective steering angle
 */
export const calculateSpeedDependentSteering = (
  speedPercent: number,
  steeringInput: number,
  maxSteeringAngle: number = 0.4 // Radians (~23 degrees)
): number => {
  // At high speed, reduce steering responsiveness (understeer effect)
  const speedReduction = Math.min(1, speedPercent * 1.2);
  const effectiveAngle = maxSteeringAngle * (1 - speedReduction * 0.6);
  
  return steeringInput * effectiveAngle;
};

/**
 * Realistic engine power curve
 * Torque increases to peak at ~70% of max speed, then falls off
 * @param speedPercent - Speed as percentage of max (0-1)
 * @param engineLevel - Engine upgrade level (1-8)
 * @param turboLevel - Turbo upgrade level (1-5)
 * @returns Power multiplier (0-1+)
 */
export const getEnginePowerCurve = (
  speedPercent: number,
  engineLevel: number = 1,
  turboLevel: number = 1
): number => {
  const peakRPM = 0.7; // Peak power at 70% max speed
  const clampedSpeed = Math.min(1, speedPercent);
  
  let powerMultiplier: number;
  
  if (clampedSpeed < peakRPM) {
    // Linear increase to peak (0-70%)
    powerMultiplier = clampedSpeed / peakRPM;
  } else {
    // Exponential falloff after peak (70-100%)
    const falloff = (clampedSpeed - peakRPM) / (1 - peakRPM);
    powerMultiplier = Math.exp(-falloff * falloff * 2.5);
  }
  
  // Apply upgrade multipliers
  const engineBoost = 1 + (engineLevel - 1) * 0.15;
  const turboBoost = 1 + (turboLevel - 1) * 0.2;
  
  return powerMultiplier * engineBoost * turboBoost;
};

/**
 * Calculates realistic grip based on tire compound and conditions
 * @param baseGrip - Base grip coefficient (0.6-1.0)
 * @param tireLevel - Tire upgrade level (1-5)
 * @param temperature - Tire temperature (20-120°C)
 * @param isWet - Whether conditions are wet
 * @returns Grip multiplier
 */
export const calculateTireGrip = (
  baseGrip: number = 0.9,
  tireLevel: number = 1,
  temperature: number = 80,
  isWet: boolean = false
): number => {
  // Tire compound upgrades increase grip
  const tireBoost = 1 + (tireLevel - 1) * 0.12;
  
  // Tire temperature curve (optimal around 80°C)
  const optimalTemp = 80;
  const tempDelta = Math.abs(temperature - optimalTemp);
  const tempGrip = Math.exp(-tempDelta * tempDelta / 1000);
  
  // Wet weather penalty
  const weatherMultiplier = isWet ? 0.65 : 1.0;
  
  return baseGrip * tireBoost * tempGrip * weatherMultiplier;
};

/**
 * Updates tire temperature based on lateral forces
 * @param currentTemp - Current tire temperature
 * @param lateralForce - Lateral acceleration (G-forces)
 * @param isAccelerating - Whether car is accelerating hard
 * @param dt - Delta time
 * @returns Updated temperature
 */
export const updateTireTemperature = (
  currentTemp: number,
  lateralForce: number,
  isAccelerating: boolean,
  dt: number
): number => {
  // Heating rate based on lateral forces and acceleration
  const lateralHeating = Math.abs(lateralForce) * 8;
  const accelHeating = isAccelerating ? 5 : 0;
  const totalHeating = (lateralHeating + accelHeating) * dt;
  
  // Natural cooling
  const cooling = (currentTemp - 20) * 0.05 * dt; // Cool down towards ambient
  
  let newTemp = currentTemp + totalHeating - cooling;
  
  // Clamp temperature to realistic range (20-120°C)
  return Math.max(20, Math.min(120, newTemp));
};

/**
 * Advanced drift detection and scoring
 */
export interface DriftState {
  isActive: boolean;
  angle: number;           // Current drift angle
  speed: number;           // Speed during drift
  duration: number;        // How long drift has been active
  score: number;           // Current drift score
  maxCombo: number;        // Best combo multiplier achieved
}

export const createDriftState = (): DriftState => ({
  isActive: false,
  angle: 0,
  speed: 0,
  duration: 0,
  score: 0,
  maxCombo: 1
});

/**
 * Updates drift state
 * @param drift - Current drift state
 * @param steeringAngle - Current steering angle
 * @param speedPercent - Speed as percentage of max
 * @param isBraking - Whether car is braking
 * @param dt - Delta time
 * @returns Updated drift state
 */
export const updateDriftState = (
  drift: DriftState,
  steeringAngle: number,
  speedPercent: number,
  isBraking: boolean,
  dt: number
): DriftState => {
  const slipThreshold = 0.25; // Slip angle threshold (radians)
  const minDriftSpeed = 0.15; // Minimum 15% speed for drift
  
  // Calculate slip angle
  const currentSlip = Math.abs(steeringAngle) * 2; // Simplified slip calculation
  
  // Check drift activation
  const shouldBeDrifting = currentSlip > slipThreshold && isBraking && speedPercent > minDriftSpeed;
  
  if (shouldBeDrifting && !drift.isActive) {
    // Start new drift
    return {
      ...drift,
      isActive: true,
      duration: 0,
      score: 0,
      angle: 0
    };
  } else if (!shouldBeDrifting && drift.isActive) {
    // End drift - calculate final score
    return {
      ...drift,
      isActive: false,
      maxCombo: Math.max(drift.maxCombo, drift.score > 500 ? 2 : 1)
    };
  }
  
  if (drift.isActive) {
    drift.duration += dt;
    // Score based on angle and speed
    const driftIntensity = currentSlip * speedPercent;
    const comboMultiplier = 1 + (drift.duration > 2 ? 0.5 : 0); // 1.5x after 2 seconds
    drift.score += driftIntensity * dt * 200 * comboMultiplier;
    drift.angle = currentSlip;
  }
  
  return drift;
};
