/**
 * Car Sprite Loader & Manager
 * Handles loading, caching, and extracting sprites from sprite sheets
 */

// Sprite sheet configuration based on analysis:
// cars.png: 1000x3900 - 4 cars x 13 rotation frames (250x300 per cell)
// cars2.png: 745x258 - 3 additional car variants (248x258 per cell)

export interface SpriteConfig {
  spriteWidth: number;
  spriteHeight: number;
  columns: number;
  rows: number;
}

export interface CarSpriteData {
  image: HTMLImageElement;
  config: SpriteConfig;
}

export type CarModel = 'speedster' | 'drifter' | 'tank' | 'interceptor';
export type RotationFrame = number; // 0-12 for 13 rotation angles

// Cache for loaded images
const imageCache: Map<string, CarSpriteData> = new Map();

/**
 * Load an image from URL and return a promise that resolves when loaded
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Load and cache a car sprite sheet
 */
export const loadCarSprites = async (
  name: string,
  src: string,
  config: SpriteConfig
): Promise<CarSpriteData> => {
  if (imageCache.has(name)) {
    return imageCache.get(name)!;
  }

  try {
    const image = await loadImage(src);
    const data: CarSpriteData = { image, config };
    imageCache.set(name, data);
    return data;
  } catch (error) {
    console.warn(`Failed to load sprite sheet ${name}:`, error);
    throw error;
  }
};

/**
 * Get cached sprite data
 */
export const getCachedSprites = (name: string): CarSpriteData | undefined => {
  return imageCache.get(name);
};

/**
 * Initialize all car sprite sheets
 */
export const initializeCarSprites = async (): Promise<void> => {
  try {
    // Main car sprite sheet: 4 cars x 13 rotation frames
    await loadCarSprites('cars', '/src/assets/cars.png', {
      spriteWidth: 250,
      spriteHeight: 300,
      columns: 4,
      rows: 13,
    });

    // Additional car variants: 3 cars x 1 frame (or could be different views)
    await loadCarSprites('cars2', '/src/assets/cars2.png', {
      spriteWidth: 248,
      spriteHeight: 258,
      columns: 3,
      rows: 1,
    });

    console.log('Car sprites loaded successfully');
  } catch (error) {
    console.warn('Some car sprites failed to load, will fallback to procedural rendering');
  }
};

/**
 * Get the sprite index for a car model
 */
export const getCarModelIndex = (model: CarModel): number => {
  const indices: Record<CarModel, number> = {
    speedster: 0,
    drifter: 1,
    tank: 2,
    interceptor: 3,
  };
  return indices[model];
};

/**
 * Get the rotation frame index based on angle
 * @param angle - Angle in radians (0 = facing up/north)
 * @returns Frame index (0-12 for 13 frames covering 360 degrees)
 */
export const getRotationFrameIndex = (angle: number): number => {
  // Normalize angle to 0-2PI
  let normalizedAngle = angle % (2 * Math.PI);
  if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;

  // 13 frames cover 360 degrees, each frame covers ~27.69 degrees
  const frameCount = 13;
  const frameAngle = (2 * Math.PI) / frameCount;

  // Calculate frame index
  const frameIndex = Math.floor(normalizedAngle / frameAngle);
  return frameIndex % frameCount;
};

/**
 * Draw a car sprite at the specified position
 */
export const drawCarSprite = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  model: CarModel,
  rotationFrame: number,
  spriteSheet: 'cars' | 'cars2' = 'cars'
): boolean => {
  const spriteData = getCachedSprites(spriteSheet);
  
  if (!spriteData) {
    return false; // Sprite not loaded, fallback needed
  }

  const { image, config } = spriteData;
  const modelIndex = getCarModelIndex(model);

  // Calculate source rectangle in sprite sheet
  const srcX = modelIndex * config.spriteWidth;
  const srcY = rotationFrame * config.spriteHeight;

  // Draw the sprite
  ctx.drawImage(
    image,
    srcX, srcY, config.spriteWidth, config.spriteHeight, // Source
    x - width / 2, y - height, width, height // Destination (centered)
  );

  return true;
};

/**
 * Check if sprites are initialized and ready
 */
export const areSpritesReady = (): boolean => {
  return imageCache.size > 0;
};

/**
 * Clear sprite cache (useful for hot reloading)
 */
export const clearSpriteCache = (): void => {
  imageCache.clear();
};
