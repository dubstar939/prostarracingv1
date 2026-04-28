/**
 * Car Sprite Loader & Manager
 * Loads the four per-car GIF assets and provides a deterministic CAR_ASSETS map.
 */

import car1 from "../assets/car1.gif";
import car2 from "../assets/car2.gif";
import car3 from "../assets/car3.gif";
import car4 from "../assets/car4.gif";

export const CAR_ASSETS = {
  car1,
  car2,
  car3,
  car4,
} as const;

export const cars = Object.values(CAR_ASSETS);

export type CarModel = 'speedster' | 'drifter' | 'tank' | 'interceptor';

const MODEL_TO_ASSET: Record<CarModel, keyof typeof CAR_ASSETS> = {
  speedster: 'car1',
  drifter: 'car2',
  tank: 'car3',
  interceptor: 'car4',
};

const imageCache: Map<keyof typeof CAR_ASSETS, HTMLImageElement> = new Map();

/**
 * Load an image from URL and return a promise that resolves when loaded.
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Preload all four car GIFs into the in-memory cache.
 */
export const initializeCarSprites = async (): Promise<void> => {
  try {
    await Promise.all(
      (Object.keys(CAR_ASSETS) as Array<keyof typeof CAR_ASSETS>).map(async (key) => {
        if (imageCache.has(key)) return;
        const img = await loadImage(CAR_ASSETS[key]);
        imageCache.set(key, img);
      })
    );
    console.log('Car sprites loaded successfully');
  } catch (error) {
    console.warn('Some car sprites failed to load, will fallback to procedural rendering:', error);
  }
};

/**
 * Check if sprites are initialized and ready.
 */
export const areSpritesReady = (): boolean => {
  return imageCache.size === Object.keys(CAR_ASSETS).length;
};

/**
 * Draw the car GIF for the given model at the specified position.
 * Returns false if the asset isn't loaded yet so the caller can fall back.
 */
export const drawCarSprite = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  model: CarModel
): boolean => {
  const assetKey = MODEL_TO_ASSET[model];
  const image = imageCache.get(assetKey);
  if (!image || !image.complete || image.naturalWidth === 0) {
    return false;
  }
  ctx.drawImage(image, x - width / 2, y - height, width, height);
  return true;
};

/**
 * Clear sprite cache (useful for hot reloading).
 */
export const clearSpriteCache = (): void => {
  imageCache.clear();
};
