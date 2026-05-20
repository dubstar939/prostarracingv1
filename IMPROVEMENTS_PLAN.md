# ProStar Racing v1 - Systems Improvement Plan

## Priority 1: Minimap Track Visualization 🗺️

### Current Issues
- Minimap shows circular track representation (lines 1913-1938)
- Doesn't reflect actual track layout (S-curves, elevation, specific themes)
- Uses simple circular progress indicator
- No visual correlation between minimap and actual road

### Improvements Needed

#### 1. Track Path Rendering
- **Implement track curve visualization** in minimap
- Draw actual road curves/segments proportionally
- Show elevation changes with color gradients (darker = lower, lighter = higher)
- Display theme-specific visual indicators

#### 2. Advanced Features
- **Checkpoint visualization**: Mark checkpoint locations on minimap
- **Road width indication**: Show narrower/wider sections
- **Elevation profile**: Vertical bar showing current elevation
- **Turn indicator**: Next turn direction/severity
- **Sector times**: Show split times on minimap sectors

#### 3. Implementation Strategy
```typescript
// Minimap Data Structure
interface MinimapSegment {
  progress: number;        // 0-1 along track
  curve: number;           // -1 to 1 curve severity
  elevation: number;       // relative height
  isCheckpoint: boolean;
  theme: string;
}

// Render approach:
// 1. Scale track to fit minimap bounds
// 2. Draw road path as curved line with thickness
// 3. Color code by elevation/theme
// 4. Position player/opponents on actual track path
// 5. Show upcoming sector info
```

---

## Priority 2: Collision System Overhaul 🚗💥

### Current Issues
- **Hitbox detection** (lines 1018-1020): Simple distance-based detection
- **Collision response**: Jerky, unpredictable car behavior
- **Car clipping**: Cars overlap visually, physics don't prevent interpenetration
- **Poor separation**: Push factor (0.3-0.5) insufficient for true separation

### Collision Detection Problems

```typescript
// Current (BROKEN):
if (Math.abs(zDiff) < 400 && Math.abs(opp.offset - playerX) < 0.3) {
  handleCollision(opp);
}
// Problems:
// - Only checks 400 units Z-distance (very tight)
// - Only checks X offset 0.3 (overlapping cars already)
// - No continuous collision prevention
// - Cars can clip through each other
```

### Improvements Needed

#### 1. Proper Hitbox System
```typescript
interface Car {
  z: number;              // Z position (forward/backward)
  offset: number;         // X position (-1.4 to 1.4)
  width: number;          // Car width in world units (0.3)
  length: number;         // Car length in world units (0.5)
  velocity: number;       // Speed
}

// Axis-Aligned Bounding Box (AABB) collision
function detectCollision(car1: Car, car2: Car): boolean {
  const minDist = (car1.width + car2.width) / 2 + 0.1; // safety margin
  const lenDist = (car1.length + car2.length) / 2 + 0.1;
  
  return Math.abs(car1.offset - car2.offset) < minDist &&
         Math.abs(car1.z - car2.z) < lenDist;
}
```

#### 2. Smooth Collision Response
```typescript
function handleCollision(player: Car, opp: Opponent) {
  // 1. Calculate collision normal (direction of impact)
  const deltaX = player.offset - opp.offset;
  const deltaZ = player.z - opp.z;
  const distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
  const normalX = deltaX / distance;
  const normalZ = deltaZ / distance;
  
  // 2. Relative velocity
  const relVelX = player.velocity * 0 - opp.speed * 0; // simplified
  const relVelZ = player.velocity - opp.speed;
  const velAlongNormal = relVelX * normalX + relVelZ * normalZ;
  
  // 3. Only collide if moving towards each other
  if (velAlongNormal < 0) {
    // 4. Apply impulse-based response
    const restitution = 0.6; // bounciness
    const impulseMagnitude = -(1 + restitution) * velAlongNormal / 2;
    
    // Push cars apart proportionally by speed difference
    const speedRatio = player.velocity / (player.velocity + opp.speed);
    player.offset += normalX * impulseMagnitude * speedRatio * 0.5;
    opp.offset -= normalX * impulseMagnitude * (1 - speedRatio) * 0.5;
    
    // Speed adjustment
    const speedLoss = Math.abs(player.velocity - opp.speed) * 0.15;
    if (player.velocity > opp.speed) {
      player.velocity *= 0.85;
    } else {
      opp.speed *= 0.85;
    }
  }
}
```

#### 3. Continuous Collision Prevention
- Check collision **every frame** (already done)
- Add **predictive collision** detection (look ahead)
- Implement **constraints** to prevent overlap:
  - Maximum offset adjustment per frame
  - Prevent cars from occupying same space
  - Smooth separation over multiple frames

#### 4. Visual Feedback
- Add **collision damage** to both cars
- Play **impact sound** with volume based on speed difference
- Create **spark particles** on impact
- Apply **screen shake** proportional to impact force

---

## Priority 3: Driving Mechanics & Controls 🎮

### Current Issues (Lines 722-817)

#### Input Responsiveness Problems
```typescript
// Current steering (LINE 798-802):
const steeringInput = (keysRef.current['ArrowLeft'] || keysRef.current['KeyA'] ? -1 : 0) + 
                      (keysRef.current['ArrowRight'] || keysRef.current['KeyD'] ? 1 : 0) + 
                      (useTilt ? tiltRef.current : 0);

playerX += steeringInput * dt * currentHandling * driftFactor * speedPercent;
```
**Problems:**
- Binary input (full left OR full right, no blending)
- Steering feels snappy/unresponsive at high speeds
- No input buffering/smoothing
- Handling response depends on speed (good) but also damage (needs tuning)
- No feedback for input lag

#### Acceleration/Deceleration
```typescript
// Current (BROKEN PHYSICS):
const baseAccel = maxSpeed / 4;  // Hardcoded value
const accel = baseAccel + (turboAccel * 100);
const breaking = -maxSpeed * 2.5;
const decel = -maxSpeed / 4;
```
**Problems:**
- Arbitrary multipliers
- No engine power curve
- Unrealistic acceleration/braking
- No transmission simulation
- Turbo feels disconnected from normal acceleration

#### Tire Physics Issues
```typescript
// Current (SIMPLIFIED):
const baseGrip = (weather === 'rain' ? 0.55 : 0.9) + (tireGrip / 150);
const speedFactor = Math.max(0, 1 - (speed / maxSpeed) * 0.4);
const grip = baseGrip * speedFactor;
```
**Problems:**
- Grip doesn't increase with lateral forces properly
- No tire temperature/wear
- Weather doesn't affect performance realistically
- Off-road penalty too simplistic

### Improvements Needed

#### 1. Better Input Handling
```typescript
// Smooth input buffering
const inputState = {
  steerTarget: 0,    // Target steering (-1 to 1)
  steerCurrent: 0,   // Actual steering (smoothed)
  accelTarget: 0,    // 0 = coast, 1 = full throttle
  accelCurrent: 0,
  brakeTarget: 0,
};

// Each frame:
const steerResponseTime = 0.15; // seconds to reach target
inputState.steerCurrent += (inputState.steerTarget - inputState.steerCurrent) * 
                           (dt / steerResponseTime);

// Apply with clamp
inputState.steerCurrent = Math.max(-1, Math.min(1, inputState.steerCurrent));
```

#### 2. Realistic Acceleration Model
```typescript
// Engine power curve (torque vs RPM simulation)
function getEnginePower(speedPercent: number, carConfig: CarConfig): number {
  // Peak power at 70% max speed (realistic for cars)
  const peakRPM = 0.7;
  const speedRatio = Math.min(1, speedPercent);
  
  // Torque curve: increases then falls off
  let powerMultiplier = 1;
  if (speedRatio < peakRPM) {
    // Linear increase to peak
    powerMultiplier = speedRatio / peakRPM;
  } else {
    // Exponential falloff after peak
    const falloff = (speedRatio - peakRPM) / (1 - peakRPM);
    powerMultiplier = Math.exp(-falloff * falloff * 2);
  }
  
  const basePower = 8000 * (carConfig.engine * 0.5);
  const turboPower = carConfig.turbo * 1500;
  return (basePower + turboPower) * powerMultiplier;
}

// Acceleration calculation:
if (isAccelerating) {
  const enginePower = getEnginePower(speedPercent, carConfig);
  const resistance = speed * 0.3; // aerodynamic drag
  const netForce = enginePower * grip - resistance;
  speed += netForce * dt / 1000; // mass factor
}
```

#### 3. Improved Braking
```typescript
// Progressive braking (like real cars)
const brakingForce = maxSpeed * (2.5 + carConfig.tires * 0.3); // better tires = better braking

if (isBraking) {
  const brakeIntensity = 1.0; // Could be 0-1 for modulation
  speed -= brakingForce * brakeIntensity * grip * dt;
  // Braking causes more tire smoke
  if (isDrifting) {
    smokeIntensity *= 1.5;
  }
}
```

#### 4. Advanced Tire Physics
```typescript
interface TireState {
  temperature: number; // 0-100 (hot = better grip up to point)
  wear: number;        // 0-100 (degradation)
  grip: number;        // 0-1 (actual grip coefficient)
  lastLateralG: number; // for tire heating
}

function updateTirePhysics(tire: TireState, lateralAccel: number, dt: number) {
  // Temperature dynamics
  const heatingRate = Math.abs(lateralAccel) * 5; // G-forces heat tires
  tire.temperature += heatingRate * dt;
  tire.temperature -= tire.temperature * 0.05 * dt; // cooling
  tire.temperature = Math.max(20, Math.min(110, tire.temperature)); // clamp
  
  // Optimal temp is around 80°C
  const tempOptimal = 80;
  const tempDelta = Math.abs(tire.temperature - tempOptimal);
  const tempGrip = Math.exp(-tempDelta * tempDelta / 1000);
  
  // Wear reduces grip
  const wearPenalty = 1 - (tire.wear / 100) * 0.3;
  
  tire.grip = baseGrip * tempGrip * wearPenalty;
}
```

#### 5. Speed-Dependent Steering
```typescript
// More realistic steering feel
const maxSteeringAngle = 40; // degrees at standstill
const speedReduction = Math.min(1, speedPercent * 1.5);
const effectiveSteeringAngle = maxSteeringAngle * (1 - speedReduction * 0.6);

// Apply steering with natural feel
const steeringRate = 360; // degrees per second max turn rate
driftAngle += (steeringInput * effectiveSteeringAngle - driftAngle) * dt * (steeringRate / 90);
```

#### 6. Drift Mechanics Enhancement
```typescript
// Current drift is too simple
const isDrifting = isBraking && isSteering && speed > maxSpeed * 0.15;

// Better drift detection with threshold
interface DriftState {
  isActive: boolean;
  angle: number;
  speed: number;
  duration: number;
  score: number;
}

function updateDrift(drift: DriftState, steeringInput: number, speedPercent: number) {
  const slipThreshold = 0.3; // slip angle threshold (radians)
  const currentSlip = Math.abs(driftAngle - (steeringInput * 0.3));
  
  if (currentSlip > slipThreshold && isBraking && speedPercent > 0.15) {
    if (!drift.isActive) {
      drift.isActive = true;
      drift.duration = 0;
      drift.score = 0;
      audioManager.playDriftStart();
    }
  } else if (drift.isActive) {
    // Drift ended
    drift.isActive = false;
    // Award score
  }
  
  if (drift.isActive) {
    drift.duration += dt;
    drift.score += Math.abs(currentSlip) * speedPercent * 100;
  }
}
```

---

## Implementation Priority

### Phase 1: Collision System (Critical)
- [ ] Implement AABB collision detection
- [ ] Add impulse-based collision response
- [ ] Prevent car clipping
- [ ] Add collision visual/audio feedback

### Phase 2: Control Responsiveness (High)
- [ ] Add input smoothing/buffering
- [ ] Improve steering feel at different speeds
- [ ] Fix acceleration curves
- [ ] Enhance braking mechanics

### Phase 3: Minimap (Medium)
- [ ] Extract track segment data
- [ ] Render actual track path
- [ ] Add elevation visualization
- [ ] Show checkpoints and sectors

### Phase 4: Advanced Features (Nice-to-Have)
- [ ] Tire physics/temperature
- [ ] Advanced drift scoring
- [ ] Tire wear simulation
- [ ] Engine power curve modeling

---

## Testing Checklist

### Collision Tests
- [ ] Cars don't overlap when colliding
- [ ] Push force proportional to speed difference
- [ ] Smooth, natural-feeling separation
- [ ] No jerky teleporting
- [ ] Works with walls/road boundaries

### Control Tests
- [ ] Steering feels responsive at all speeds
- [ ] Acceleration smooth and progressive
- [ ] Braking feels natural
- [ ] Drift mechanics work reliably
- [ ] Mobile tilt controls responsive

### Minimap Tests
- [ ] Accurately shows track layout
- [ ] Player position correct
- [ ] Opponent positions accurate
- [ ] Elevation visualization clear
- [ ] Checkpoints marked

---

## Performance Considerations

- Collision detection: O(n²) but only checks nearby cars
- Minimap rendering: Pre-computed path, only update player positions
- Input smoothing: Negligible cost
- Tire physics: Can be disabled for low-end devices

