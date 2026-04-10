/**
 * Math utilities for Cosmic Cults
 */

import type { WorldPosition } from '@cosmic-cults/types';

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Smooth step interpolation
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Calculate distance between two world positions
 */
export function worldDistance(a: WorldPosition, b: WorldPosition): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Normalize a world position vector
 */
export function normalizePosition(pos: WorldPosition): WorldPosition {
  const length = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
  if (length === 0) return { x: 0, y: 0, z: 0 };
  return {
    x: pos.x / length,
    y: pos.y / length,
    z: pos.z / length,
  };
}

/**
 * Linear interpolation between two world positions
 */
export function lerpPosition(
  a: WorldPosition,
  b: WorldPosition,
  t: number,
): WorldPosition {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t),
  };
}

/**
 * Add two world positions
 */
export function addPosition(a: WorldPosition, b: WorldPosition): WorldPosition {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  };
}

/**
 * Subtract position b from position a
 */
export function subtractPosition(
  a: WorldPosition,
  b: WorldPosition,
): WorldPosition {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  };
}

/**
 * Scale a world position
 */
export function scalePosition(
  pos: WorldPosition,
  scale: number,
): WorldPosition {
  return {
    x: pos.x * scale,
    y: pos.y * scale,
    z: pos.z * scale,
  };
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Generate a random float between min and max
 */
export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}
