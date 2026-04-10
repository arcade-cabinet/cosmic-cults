/**
 * Property-based tests for hex grid utilities
 */

import type { HexCoord } from '@cosmic-cults/types';
import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  axialToCube,
  cubeToAxial,
  HEX_SIZE,
  hexAdd,
  hexDistance,
  hexEquals,
  hexesInRange,
  hexLine,
  hexNeighbors,
  hexSubtract,
  hexToWorld,
  worldToHex,
} from './index';

// Arbitrary for hex coordinates
const hexArbitrary = fc.record({
  q: fc.integer({ min: -100, max: 100 }),
  r: fc.integer({ min: -100, max: 100 }),
});

describe('Hex Grid Utilities', () => {
  describe('Coordinate Conversions', () => {
    it('axial to cube and back is identity', () => {
      fc.assert(
        fc.property(hexArbitrary, (hex) => {
          const cube = axialToCube(hex);
          const result = cubeToAxial(cube);
          expect(hexEquals(hex, result)).toBe(true);
        }),
      );
    });

    it('cube coordinates sum to zero', () => {
      fc.assert(
        fc.property(hexArbitrary, (hex) => {
          const cube = axialToCube(hex);
          expect(cube.x + cube.y + cube.z).toBe(0);
        }),
      );
    });
  });

  describe('Distance', () => {
    it('distance to self is zero', () => {
      fc.assert(
        fc.property(hexArbitrary, (hex) => {
          expect(hexDistance(hex, hex)).toBe(0);
        }),
      );
    });

    it('distance is symmetric', () => {
      fc.assert(
        fc.property(hexArbitrary, hexArbitrary, (a, b) => {
          expect(hexDistance(a, b)).toBe(hexDistance(b, a));
        }),
      );
    });

    it('distance is non-negative', () => {
      fc.assert(
        fc.property(hexArbitrary, hexArbitrary, (a, b) => {
          expect(hexDistance(a, b)).toBeGreaterThanOrEqual(0);
        }),
      );
    });

    it('distance to neighbor is 1', () => {
      fc.assert(
        fc.property(hexArbitrary, (hex) => {
          const neighbors = hexNeighbors(hex);
          neighbors.forEach((neighbor) => {
            expect(hexDistance(hex, neighbor)).toBe(1);
          });
        }),
      );
    });
  });

  describe('Arithmetic', () => {
    it('add and subtract are inverse', () => {
      fc.assert(
        fc.property(hexArbitrary, hexArbitrary, (a, b) => {
          const sum = hexAdd(a, b);
          const result = hexSubtract(sum, b);
          expect(hexEquals(a, result)).toBe(true);
        }),
      );
    });

    it('adding zero is identity', () => {
      fc.assert(
        fc.property(hexArbitrary, (hex) => {
          const zero: HexCoord = { q: 0, r: 0 };
          expect(hexEquals(hexAdd(hex, zero), hex)).toBe(true);
        }),
      );
    });
  });

  describe('World Conversion', () => {
    it('hex to world and back preserves coordinate', () => {
      fc.assert(
        fc.property(hexArbitrary, (hex) => {
          const world = hexToWorld(hex, HEX_SIZE);
          const result = worldToHex(world, HEX_SIZE);
          expect(hexEquals(hex, result)).toBe(true);
        }),
      );
    });

    it('origin hex maps to origin world', () => {
      const origin: HexCoord = { q: 0, r: 0 };
      const world = hexToWorld(origin);
      expect(world.x).toBeCloseTo(0);
      expect(world.y).toBe(0);
      expect(world.z).toBeCloseTo(0);
    });
  });

  describe('Range and Line', () => {
    it('hexes in range includes center', () => {
      fc.assert(
        fc.property(
          hexArbitrary,
          fc.integer({ min: 0, max: 5 }),
          (center, radius) => {
            const hexes = hexesInRange(center, radius);
            expect(hexes.some((h) => hexEquals(h, center))).toBe(true);
          },
        ),
      );
    });

    it('hexes in range count is correct', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 10 }), (radius) => {
          const center: HexCoord = { q: 0, r: 0 };
          const hexes = hexesInRange(center, radius);
          // Formula: 3n² + 3n + 1 where n is radius
          const expected = 3 * radius * radius + 3 * radius + 1;
          expect(hexes.length).toBe(expected);
        }),
      );
    });

    it('hex line includes endpoints', () => {
      fc.assert(
        fc.property(hexArbitrary, hexArbitrary, (a, b) => {
          const line = hexLine(a, b);
          expect(line.some((h) => hexEquals(h, a))).toBe(true);
          expect(line.some((h) => hexEquals(h, b))).toBe(true);
        }),
      );
    });

    it('hex line length equals distance + 1', () => {
      fc.assert(
        fc.property(hexArbitrary, hexArbitrary, (a, b) => {
          const line = hexLine(a, b);
          const distance = hexDistance(a, b);
          expect(line.length).toBe(distance + 1);
        }),
      );
    });
  });

  describe('Neighbors', () => {
    it('each hex has exactly 6 neighbors', () => {
      fc.assert(
        fc.property(hexArbitrary, (hex) => {
          expect(hexNeighbors(hex).length).toBe(6);
        }),
      );
    });

    it('all neighbors are unique', () => {
      fc.assert(
        fc.property(hexArbitrary, (hex) => {
          const neighbors = hexNeighbors(hex);
          const unique = new Set(neighbors.map((n) => `${n.q},${n.r}`));
          expect(unique.size).toBe(6);
        }),
      );
    });
  });
});
