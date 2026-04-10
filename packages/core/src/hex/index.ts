/**
 * Hex grid utilities using axial coordinates
 * Based on Red Blob Games hex grid reference
 * https://www.redblobgames.com/grids/hexagons/
 *
 * Uses pointy-top orientation for isometric view
 */

import type { CubeCoord, HexCoord, WorldPosition } from '@cosmic-cults/types';

// Hex size (distance from center to corner)
export const HEX_SIZE = 1.0;

// Spacing multiplier for hex grid
const SQRT_3 = Math.sqrt(3);

/**
 * Convert axial coordinates to cube coordinates
 */
export function axialToCube(hex: HexCoord): CubeCoord {
  const x = hex.q;
  const z = hex.r;
  const y = -x - z;
  return { x, y, z };
}

/**
 * Convert cube coordinates to axial coordinates
 */
export function cubeToAxial(cube: CubeCoord): HexCoord {
  return { q: cube.x, r: cube.z };
}

/**
 * Round floating point cube coordinates to nearest hex
 */
export function cubeRound(cube: CubeCoord): CubeCoord {
  let rx = Math.round(cube.x);
  let ry = Math.round(cube.y);
  let rz = Math.round(cube.z);

  const xDiff = Math.abs(rx - cube.x);
  const yDiff = Math.abs(ry - cube.y);
  const zDiff = Math.abs(rz - cube.z);

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }

  return { x: rx, y: ry, z: rz };
}

/**
 * Round floating point axial coordinates to nearest hex
 */
export function axialRound(hex: HexCoord): HexCoord {
  return cubeToAxial(cubeRound(axialToCube(hex)));
}

/**
 * Get distance between two hexes
 */
export function hexDistance(a: HexCoord, b: HexCoord): number {
  const ac = axialToCube(a);
  const bc = axialToCube(b);
  return (
    (Math.abs(ac.x - bc.x) + Math.abs(ac.y - bc.y) + Math.abs(ac.z - bc.z)) / 2
  );
}

/**
 * Check if two hex coordinates are equal
 */
export function hexEquals(a: HexCoord, b: HexCoord): boolean {
  return a.q === b.q && a.r === b.r;
}

/**
 * Add two hex coordinates
 */
export function hexAdd(a: HexCoord, b: HexCoord): HexCoord {
  return { q: a.q + b.q, r: a.r + b.r };
}

/**
 * Subtract hex b from hex a
 */
export function hexSubtract(a: HexCoord, b: HexCoord): HexCoord {
  return { q: a.q - b.q, r: a.r - b.r };
}

/**
 * Get the 6 neighboring hex directions
 */
export const HEX_DIRECTIONS: HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

/**
 * Get all 6 neighbors of a hex
 */
export function hexNeighbors(hex: HexCoord): HexCoord[] {
  return HEX_DIRECTIONS.map((dir) => hexAdd(hex, dir));
}

/**
 * Get a specific neighbor by direction index (0-5)
 */
export function hexNeighbor(hex: HexCoord, direction: number): HexCoord {
  const dir = HEX_DIRECTIONS[direction % 6];
  if (!dir) {
    throw new Error(`Invalid direction index: ${direction}`);
  }
  return hexAdd(hex, dir);
}

/**
 * Convert hex coordinate to world position (pointy-top)
 */
export function hexToWorld(
  hex: HexCoord,
  size: number = HEX_SIZE,
): WorldPosition {
  const x = size * (SQRT_3 * hex.q + (SQRT_3 / 2) * hex.r);
  const z = size * ((3 / 2) * hex.r);
  return { x, y: 0, z };
}

/**
 * Convert world position to hex coordinate (pointy-top)
 */
export function worldToHex(
  pos: WorldPosition,
  size: number = HEX_SIZE,
): HexCoord {
  const q = ((SQRT_3 / 3) * pos.x - (1 / 3) * pos.z) / size;
  const r = ((2 / 3) * pos.z) / size;
  return axialRound({ q, r });
}

/**
 * Get all hexes within a given radius
 */
export function hexesInRange(center: HexCoord, radius: number): HexCoord[] {
  const results: HexCoord[] = [];
  for (let q = -radius; q <= radius; q++) {
    for (
      let r = Math.max(-radius, -q - radius);
      r <= Math.min(radius, -q + radius);
      r++
    ) {
      results.push(hexAdd(center, { q, r }));
    }
  }
  return results;
}

/**
 * Draw a line between two hexes
 */
export function hexLine(a: HexCoord, b: HexCoord): HexCoord[] {
  const distance = hexDistance(a, b);
  if (distance === 0) return [a];

  const results: HexCoord[] = [];
  for (let i = 0; i <= distance; i++) {
    const t = i / distance;
    const q = a.q + (b.q - a.q) * t;
    const r = a.r + (b.r - a.r) * t;
    results.push(axialRound({ q, r }));
  }
  return results;
}

/**
 * Get hexes forming a ring at a given radius
 */
export function hexRing(center: HexCoord, radius: number): HexCoord[] {
  if (radius === 0) return [center];

  const results: HexCoord[] = [];
  let hex = hexAdd(center, { q: -radius, r: radius }); // Start at direction 4

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      results.push(hex);
      hex = hexNeighbor(hex, i);
    }
  }

  return results;
}
