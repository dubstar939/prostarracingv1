/**
 * Advanced Collision Detection and Response System
 * Implements AABB collision detection with impulse-based physics response
 */

import { Opponent } from '../components/RacingGame';

export interface CarPhysics {
  z: number;              // Z position (forward/backward on track)
  offset: number;         // X position (-1.4 to 1.4 on road width)
  width: number;          // Car width in world units (normalized)
  length: number;         // Car length in world units (normalized)
  velocity: number;       // Current speed
  mass: number;           // Relative mass for physics (affects response)
}

/**
 * Detects collision between player and opponent using AABB collision detection
 * @param playerPhysics - Player car physics data
 * @param oppPhysics - Opponent car physics data
 * @returns true if collision detected
 */
export const detectCollisionAABB = (playerPhysics: CarPhysics, oppPhysics: CarPhysics): boolean => {
  // Calculate minimum separation distances
  const minXDist = (playerPhysics.width + oppPhysics.width) / 2 + 0.05; // 0.05 = safety margin
  const minZDist = (playerPhysics.length + oppPhysics.length) / 2 + 0.05;
  
  // Check both axes for overlap
  const xOverlap = Math.abs(playerPhysics.offset - oppPhysics.offset) < minXDist;
  const zOverlap = Math.abs(playerPhysics.z - oppPhysics.z) < minZDist;
  
  return xOverlap && zOverlap;
};

/**
 * Predictive collision detection - checks if cars will collide in the next frame
 * @param playerPhysics - Player car physics
 * @param oppPhysics - Opponent car physics
 * @param dt - Delta time
 * @returns true if collision will occur
 */
export const predictiveCollisionDetection = (
  playerPhysics: CarPhysics,
  oppPhysics: CarPhysics,
  dt: number
): boolean => {
  // Predict next positions
  const playerNextZ = playerPhysics.z + playerPhysics.velocity * dt;
  const oppNextZ = oppPhysics.z + oppPhysics.velocity * dt;
  
  const predictedPlayer: CarPhysics = {
    ...playerPhysics,
    z: playerNextZ
  };
  
  const predictedOpp: CarPhysics = {
    ...oppPhysics,
    z: oppNextZ
  };
  
  return detectCollisionAABB(predictedPlayer, predictedOpp);
};

/**
 * Calculates collision normal vector (direction of impact)
 * @param playerPhysics - Player car physics
 * @param oppPhysics - Opponent car physics
 * @returns Normalized collision normal vector
 */
const calculateCollisionNormal = (
  playerPhysics: CarPhysics,
  oppPhysics: CarPhysics
): { x: number; z: number } => {
  const deltaX = playerPhysics.offset - oppPhysics.offset;
  const deltaZ = playerPhysics.z - oppPhysics.z;
  const distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
  
  // Prevent division by zero
  if (distance < 0.001) {
    return { x: 1, z: 0 };
  }
  
  return {
    x: deltaX / distance,
    z: deltaZ / distance
  };
};

/**
 * Calculates relative velocity between two cars
 * @param playerVel - Player velocity
 * @param oppVel - Opponent velocity
 * @returns Relative velocity
 */
const calculateRelativeVelocity = (playerVel: number, oppVel: number): number => {
  return playerVel - oppVel;
};

/**
 * Handles collision response with impulse-based physics
 * Applies force to separate cars and adjust velocities
 */
export interface CollisionResponse {
  playerOffsetDelta: number;  // Change in player offset (X-axis)
  oppOffsetDelta: number;     // Change in opponent offset (X-axis)
  playerVelocityMultiplier: number; // Speed adjustment for player
  oppVelocityMultiplier: number;    // Speed adjustment for opponent
  impactForce: number;              // Magnitude of collision force (for effects)
}

export const handleCollisionResponse = (
  playerPhysics: CarPhysics,
  oppPhysics: CarPhysics
): CollisionResponse => {
  // 1. Calculate collision normal (direction of impact)
  const normal = calculateCollisionNormal(playerPhysics, oppPhysics);
  
  // 2. Calculate relative velocity
  const relVel = calculateRelativeVelocity(playerPhysics.velocity, oppPhysics.velocity);
  
  // 3. Calculate velocity along collision normal (only Z-axis matters in this 2D system)
  const velAlongNormal = relVel * normal.z;
  
  // 4. Only apply collision response if cars are moving towards each other
  if (velAlongNormal >= 0) {
    return {
      playerOffsetDelta: 0,
      oppOffsetDelta: 0,
      playerVelocityMultiplier: 1,
      oppVelocityMultiplier: 1,
      impactForce: 0
    };
  }
  
  // 5. Apply impulse-based response
  const restitution = 0.4; // Bounciness (0 = inelastic, 1 = perfectly elastic)
  const invMassPlayer = 1 / playerPhysics.mass;
  const invMassOpp = 1 / oppPhysics.mass;
  const invMassSum = invMassPlayer + invMassOpp;
  
  // Impulse magnitude
  const impulseMagnitude = -(1 + restitution) * velAlongNormal / invMassSum;
  
  // 6. Separate cars on X-axis to prevent overlap
  const minXDist = (playerPhysics.width + oppPhysics.width) / 2 + 0.1;
  const currentXDist = Math.abs(playerPhysics.offset - oppPhysics.offset);
  const overlapAmount = Math.max(0, minXDist - currentXDist);
  const separationDirection = playerPhysics.offset > oppPhysics.offset ? 1 : -1;
  
  // Distribute separation based on mass ratio
  const playerSeparation = (overlapAmount * 0.5 * invMassPlayer / invMassSum) * separationDirection;
  const oppSeparation = -(overlapAmount * 0.5 * invMassOpp / invMassSum) * separationDirection;
  
  // 7. Apply velocity changes (speed loss due to collision)
  const speedLoss = Math.abs(relVel) * 0.2; // 20% speed loss on collision
  const playerVelocityMultiplier = Math.max(0, 1 - (speedLoss / Math.max(playerPhysics.velocity, 100)));
  const oppVelocityMultiplier = Math.max(0, 1 - (speedLoss / Math.max(oppPhysics.velocity, 100)));
  
  return {
    playerOffsetDelta: playerSeparation,
    oppOffsetDelta: oppSeparation,
    playerVelocityMultiplier,
    oppVelocityMultiplier,
    impactForce: Math.abs(impulseMagnitude)
  };
};

/**
 * Prevents cars from going out of bounds (off the road)
 * @param offset - Current X offset
 * @param maxOffset - Maximum allowed offset (road width)
 * @returns Clamped offset value
 */
export const constrainToRoad = (offset: number, maxOffset: number = 1.4): number => {
  return Math.max(-maxOffset, Math.min(maxOffset, offset));
};

/**
 * Smooth separation over multiple frames to prevent jerky motion
 * @param currentSeparation - Current frame's separation amount
 * @param targetSeparation - Target total separation needed
 * @param dt - Delta time
 * @returns Smoothed separation value
 */
export const smoothSeparation = (
  currentSeparation: number,
  targetSeparation: number,
  dt: number,
  smoothingSpeed: number = 10 // Units per second
): number => {
  const maxChange = smoothingSpeed * dt;
  if (Math.abs(targetSeparation - currentSeparation) < maxChange) {
    return targetSeparation;
  }
  return currentSeparation + Math.sign(targetSeparation - currentSeparation) * maxChange;
};
