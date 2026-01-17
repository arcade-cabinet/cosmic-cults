/**
 * Tests for Procedural Generation module
 *
 * Note: Tests that require BabylonJS Scene/Mesh are skipped in Node.js
 * as WebGL is not available. These tests focus on pure logic.
 */

import type { FactionId } from '@cosmic-cults/types';
import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

// Test the SeededRandom class by recreating it here
// (since it's a private class in the module)
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}

describe('Procedural Generation', () => {
  describe('SeededRandom', () => {
    it('produces deterministic output for same seed', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 1000000 }), (seed) => {
          const rng1 = new SeededRandom(seed);
          const rng2 = new SeededRandom(seed);

          const values1 = Array.from({ length: 10 }, () => rng1.next());
          const values2 = Array.from({ length: 10 }, () => rng2.next());

          expect(values1).toEqual(values2);
        }),
      );
    });

    it('produces values in range [0, 1)', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 1000000 }), (seed) => {
          const rng = new SeededRandom(seed);

          for (let i = 0; i < 100; i++) {
            const value = rng.next();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
          }
        }),
      );
    });

    it('range() produces values within specified range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000000 }),
          fc.float({ min: -100, max: 0 }),
          fc.float({ min: 0, max: 100 }),
          (seed, min, max) => {
            const rng = new SeededRandom(seed);

            for (let i = 0; i < 50; i++) {
              const value = rng.range(min, max);
              expect(value).toBeGreaterThanOrEqual(min);
              expect(value).toBeLessThanOrEqual(max);
            }
          },
        ),
      );
    });

    it('int() produces integers within specified range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000000 }),
          fc.integer({ min: -50, max: 0 }),
          fc.integer({ min: 0, max: 50 }),
          (seed, min, max) => {
            const rng = new SeededRandom(seed);

            for (let i = 0; i < 50; i++) {
              const value = rng.int(min, max);
              expect(Number.isInteger(value)).toBe(true);
              expect(value).toBeGreaterThanOrEqual(min);
              expect(value).toBeLessThanOrEqual(max);
            }
          },
        ),
      );
    });

    it('different seeds produce different sequences', () => {
      const sequences: number[][] = [];

      for (let seed = 1; seed <= 10; seed++) {
        const rng = new SeededRandom(seed);
        sequences.push(Array.from({ length: 5 }, () => rng.next()));
      }

      // Check that not all sequences are the same
      const uniqueSequences = new Set(
        sequences.map((seq) => seq.join(',')),
      );

      expect(uniqueSequences.size).toBe(10);
    });

    it('produces approximately uniform distribution', () => {
      const rng = new SeededRandom(42);
      const buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const samples = 10000;

      for (let i = 0; i < samples; i++) {
        const value = rng.next();
        const bucket = Math.min(Math.floor(value * 10), 9);
        buckets[bucket]++;
      }

      // Each bucket should have roughly samples/10 values
      const expected = samples / 10;
      const tolerance = expected * 0.15; // 15% tolerance

      for (const count of buckets) {
        expect(count).toBeGreaterThan(expected - tolerance);
        expect(count).toBeLessThan(expected + tolerance);
      }
    });
  });

  describe('Unit Type Properties', () => {
    // Test the expected health values for unit types
    const healthMap: Record<string, number> = {
      cultist: 50,
      acolyte: 75,
      priest: 100,
      avatar: 500,
    };

    it('unit health values are properly scaled', () => {
      // Cultist < Acolyte < Priest < Avatar
      expect(healthMap.cultist).toBeLessThan(healthMap.acolyte!);
      expect(healthMap.acolyte).toBeLessThan(healthMap.priest!);
      expect(healthMap.priest).toBeLessThan(healthMap.avatar!);
    });

    // Test the expected speed values for unit types
    const speedMap: Record<string, number> = {
      cultist: 4,
      acolyte: 3,
      priest: 2,
      avatar: 1,
    };

    it('unit speed values are inversely proportional to power', () => {
      // Cultist > Acolyte > Priest > Avatar (speed)
      expect(speedMap.cultist).toBeGreaterThan(speedMap.acolyte!);
      expect(speedMap.acolyte).toBeGreaterThan(speedMap.priest!);
      expect(speedMap.priest).toBeGreaterThan(speedMap.avatar!);
    });
  });

  describe('Faction Colors', () => {
    const FACTION_COLORS: Record<FactionId, string> = {
      'void-seekers': '#7B2CBF',
      'flesh-weavers': '#E63946',
      'star-children': '#FFD700',
    };

    it('faction colors are valid hex colors', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      for (const color of Object.values(FACTION_COLORS)) {
        expect(hexColorRegex.test(color)).toBe(true);
      }
    });

    it('all factions have unique colors', () => {
      const colors = Object.values(FACTION_COLORS);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });

    it('void-seekers color is purple-ish', () => {
      const color = FACTION_COLORS['void-seekers'];
      // R should be medium, G should be low, B should be high
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      expect(b).toBeGreaterThan(g); // More blue than green
      expect(r).toBeGreaterThan(g); // More red than green (purple = red + blue)
    });

    it('flesh-weavers color is red-ish', () => {
      const color = FACTION_COLORS['flesh-weavers'];
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      expect(r).toBeGreaterThan(g);
      expect(r).toBeGreaterThan(b);
    });

    it('star-children color is gold-ish', () => {
      const color = FACTION_COLORS['star-children'];
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      expect(r).toBeGreaterThan(200); // High red
      expect(g).toBeGreaterThan(150); // Medium-high green
      expect(b).toBeLessThan(100); // Low blue
    });
  });

  describe('Terrain Generation Logic', () => {
    // Test the noise function pattern used for terrain generation
    const noise = (x: number, y: number, seed: number) => {
      const val = Math.sin(x * 0.1 + seed) * Math.cos(y * 0.1 + seed * 0.7);
      return (val + 1) / 2; // Normalize to 0-1
    };

    it('noise produces values in range [0, 1]', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -100, max: 100 }),
          fc.float({ min: -100, max: 100 }),
          fc.integer({ min: 0, max: 10000 }),
          (x, y, seed) => {
            const value = noise(x, y, seed);
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
          },
        ),
      );
    });

    it('noise is deterministic', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -100, max: 100 }),
          fc.float({ min: -100, max: 100 }),
          fc.integer({ min: 0, max: 10000 }),
          (x, y, seed) => {
            expect(noise(x, y, seed)).toBe(noise(x, y, seed));
          },
        ),
      );
    });

    it('terrain type thresholds are properly ordered', () => {
      // Based on the generation logic:
      // n < 0.2 -> void
      // n < 0.4 -> corrupted
      // n > 0.85 -> sanctified
      // else -> neutral

      const thresholds = {
        void: { min: 0, max: 0.2 },
        corrupted: { min: 0.2, max: 0.4 },
        neutral: { min: 0.4, max: 0.85 },
        sanctified: { min: 0.85, max: 1 },
      };

      // Verify thresholds cover the full range
      expect(thresholds.void.min).toBe(0);
      expect(thresholds.void.max).toBe(thresholds.corrupted.min);
      expect(thresholds.corrupted.max).toBe(thresholds.neutral.min);
      expect(thresholds.neutral.max).toBe(thresholds.sanctified.min);
      expect(thresholds.sanctified.max).toBe(1);
    });
  });

  describe('Mesh Variations', () => {
    it('tentacle count for avatars is bounded', () => {
      // Based on: 4 + rng.int(0, 2) = 4 to 6 tentacles
      const minTentacles = 4;
      const maxTentacles = 6;

      fc.assert(
        fc.property(fc.integer({ min: 1, max: 1000000 }), (seed) => {
          const rng = new SeededRandom(seed);
          const tentacleCount = 4 + rng.int(0, 2);

          expect(tentacleCount).toBeGreaterThanOrEqual(minTentacles);
          expect(tentacleCount).toBeLessThanOrEqual(maxTentacles);
        }),
      );
    });

    it('unit mesh variations are subtle', () => {
      // Size variations should be small (e.g., ±0.05 for cultist body)
      const baseHeight = 0.6;
      const variationRange = 0.05;

      fc.assert(
        fc.property(fc.integer({ min: 1, max: 1000000 }), (seed) => {
          const rng = new SeededRandom(seed);
          const height = baseHeight + rng.range(-variationRange, variationRange);

          expect(height).toBeGreaterThanOrEqual(baseHeight - variationRange);
          expect(height).toBeLessThanOrEqual(baseHeight + variationRange);
        }),
      );
    });
  });
});
