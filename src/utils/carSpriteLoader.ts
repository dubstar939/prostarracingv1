/**
 * Car Asset Loader
 *
 * Generates rear-view procedural thumbnails for every chassis on demand by
 * rendering the in-game `drawCar` routine into an offscreen canvas and caching
 * the resulting data URL. This keeps Garage / Store / victory previews in
 * lockstep with what the player actually drives during a race.
 */

import type { CarConfig, CarModelType } from '../types';
import { drawCar } from './carRenderer';

export type CarModel = CarModelType;

/**
 * Per-chassis flattering default color used to render the showroom thumbnail.
 */
const THUMBNAIL_COLORS: Record<CarModel, string> = {
  speedster: '#ef4444',
  drifter: '#22d3ee',
  muscle: '#f59e0b',
  tank: '#65a30d',
  rally: '#3b82f6',
  interceptor: '#0f172a',
  prototype: '#a855f7',
  stealth: '#1f2937',
};

const ALL_MODELS: CarModel[] = [
  'speedster',
  'drifter',
  'muscle',
  'tank',
  'rally',
  'interceptor',
  'prototype',
  'stealth',
];

const thumbnailCache: Map<CarModel, string> = new Map();

const buildThumbnailConfig = (model: CarModel): CarConfig => ({
  model,
  color: THUMBNAIL_COLORS[model] ?? '#ef4444',
  engine: 2,
  tires: 2,
  turbo: 1,
  spoiler: 'none',
  bodyKit: 'stock',
  decal: 'none',
  rims: 'standard',
});

const renderThumbnail = (model: CarModel): string => {
  const w = 360;
  const h = 270;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Soft showroom backdrop
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#1f2937');
  bg.addColorStop(1, '#0b1120');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Floor highlight
  const floor = ctx.createRadialGradient(w / 2, h * 0.85, 10, w / 2, h * 0.85, w * 0.55);
  floor.addColorStop(0, 'rgba(255,255,255,0.18)');
  floor.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, w, h);

  // Ground shadow under the car
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.82, w * 0.32, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  drawCar(ctx, w / 2, h * 0.82, 180, 110, buildThumbnailConfig(model));
  return canvas.toDataURL('image/png');
};

/**
 * Get a stable data-URL thumbnail for the given chassis. Lazily generated and
 * cached for the lifetime of the page. Falls back to an empty string if called
 * outside of a browser environment.
 */
export const getCarAssetForModel = (model: CarModel): string => {
  if (typeof document === 'undefined') return '';
  const cached = thumbnailCache.get(model);
  if (cached) return cached;
  const url = renderThumbnail(model);
  thumbnailCache.set(model, url);
  return url;
};

export const CAR_ASSETS: Record<CarModel, string> = new Proxy(
  {} as Record<CarModel, string>,
  {
    get: (_target, prop: string) => getCarAssetForModel(prop as CarModel),
    ownKeys: () => ALL_MODELS as string[],
    getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
  }
);

export const MODEL_TO_ASSET: Record<CarModel, CarModel> = ALL_MODELS.reduce(
  (acc, m) => {
    acc[m] = m;
    return acc;
  },
  {} as Record<CarModel, CarModel>
);

/**
 * Legacy image-loading API kept as no-ops so existing callers don't break.
 * The procedural pipeline doesn't need preloading.
 */
export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });

export const initializeCarSprites = async (): Promise<void> => {
  // Procedural thumbnails are generated lazily on first access.
};

export const areSpritesReady = (): boolean => true;

export const drawCarSprite = (
  _ctx: CanvasRenderingContext2D,
  _x: number,
  _y: number,
  _width: number,
  _height: number,
  _model: CarModel
): boolean => false;

export const clearSpriteCache = (): void => {
  thumbnailCache.clear();
};
