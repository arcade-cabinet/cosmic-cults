/**
 * Tests for ECS (Entity Component System) module
 */

import type { FactionId, UnitType } from '@cosmic-cults/types';
import * as fc from 'fast-check';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  aiControlled,
  createTile,
  createUnit,
  type GameEntity,
  movingEntities,
  removeEntity,
  selectedUnits,
  tiles,
  units,
  world,
} from './index';

// Arbitraries for testing
const factionArbitrary = fc.constantFrom<FactionId>(
  'void-seekers',
  'flesh-weavers',
  'star-children',
);

const unitTypeArbitrary = fc.constantFrom<UnitType>(
  'cultist',
  'acolyte',
  'priest',
  'avatar',
);

const hexCoordArbitrary = fc.record({
  q: fc.integer({ min: -50, max: 50 }),
  r: fc.integer({ min: -50, max: 50 }),
});

describe('ECS Module', () => {
  beforeEach(() => {
    // Clear the world before each test
    for (const entity of [...world.entities]) {
      world.remove(entity);
    }
  });

  describe('World', () => {
    it('starts empty', () => {
      expect(world.entities.length).toBe(0);
    });

    it('can add and remove entities', () => {
      const entity = world.add({ id: 'test-entity' });
      expect(world.entities.length).toBe(1);

      world.remove(entity);
      expect(world.entities.length).toBe(0);
    });
  });

  describe('createUnit', () => {
    it('creates a unit with correct faction and type', () => {
      fc.assert(
        fc.property(
          factionArbitrary,
          unitTypeArbitrary,
          hexCoordArbitrary,
          (faction, type, position) => {
            // Clear world first
            for (const entity of [...world.entities]) {
              world.remove(entity);
            }

            const unit = createUnit(faction, type, position);

            expect(unit.unit?.faction).toBe(faction);
            expect(unit.unit?.type).toBe(type);
            expect(unit.id).toBeDefined();
            expect(unit.health).toBeDefined();
            expect(unit.transform).toBeDefined();
          },
        ),
      );
    });

    it('assigns correct health based on unit type', () => {
      const healthMap: Record<UnitType, number> = {
        cultist: 50,
        acolyte: 75,
        priest: 100,
        avatar: 500,
      };

      for (const [type, expectedHealth] of Object.entries(healthMap)) {
        for (const entity of [...world.entities]) {
          world.remove(entity);
        }

        const unit = createUnit(
          'void-seekers',
          type as UnitType,
          { q: 0, r: 0 },
        );

        expect(unit.health?.max).toBe(expectedHealth);
        expect(unit.health?.current).toBe(expectedHealth);
      }
    });

    it('assigns correct speed based on unit type', () => {
      const speedMap: Record<UnitType, number> = {
        cultist: 4,
        acolyte: 3,
        priest: 2,
        avatar: 1,
      };

      for (const [type, expectedSpeed] of Object.entries(speedMap)) {
        for (const entity of [...world.entities]) {
          world.remove(entity);
        }

        const unit = createUnit(
          'void-seekers',
          type as UnitType,
          { q: 0, r: 0 },
        );

        expect(unit.movement?.speed).toBe(expectedSpeed);
      }
    });

    it('creates unique IDs for each unit', () => {
      const ids = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const unit = createUnit('void-seekers', 'cultist', { q: i, r: 0 });
        ids.add(unit.id);
      }

      expect(ids.size).toBe(100);
    });

    it('initializes unit as not selected', () => {
      const unit = createUnit('void-seekers', 'cultist', { q: 0, r: 0 });
      expect(unit.selected).toBe(false);
    });

    it('initializes unit as visible', () => {
      const unit = createUnit('void-seekers', 'cultist', { q: 0, r: 0 });
      expect(unit.visible).toBe(true);
    });

    it('initializes unit as not AI controlled', () => {
      const unit = createUnit('void-seekers', 'cultist', { q: 0, r: 0 });
      expect(unit.aiControlled).toBe(false);
    });
  });

  describe('createTile', () => {
    it('creates a tile with correct properties', () => {
      fc.assert(
        fc.property(hexCoordArbitrary, (coord) => {
          for (const entity of [...world.entities]) {
            world.remove(entity);
          }

          const tile = createTile({
            coord,
            terrain: 'neutral',
            visibility: 'hidden',
          });

          expect(tile.tile?.coord).toEqual(coord);
          expect(tile.tile?.terrain).toBe('neutral');
          expect(tile.tile?.visibility).toBe('hidden');
        }),
      );
    });

    it('creates tile with deterministic ID', () => {
      const tile = createTile({
        coord: { q: 5, r: -3 },
        terrain: 'corrupted',
        visibility: 'visible',
      });

      expect(tile.id).toBe('tile-5--3');
    });

    it('initializes tile as visible', () => {
      const tile = createTile({
        coord: { q: 0, r: 0 },
        terrain: 'void',
        visibility: 'hidden',
      });

      expect(tile.visible).toBe(true);
    });
  });

  describe('Archetypes', () => {
    it('units archetype queries units correctly', () => {
      createUnit('void-seekers', 'cultist', { q: 0, r: 0 });
      createUnit('flesh-weavers', 'priest', { q: 1, r: 0 });

      // Non-unit entity
      world.add({ id: 'other' });

      expect([...units].length).toBe(2);
    });

    it('tiles archetype queries tiles correctly', () => {
      createTile({
        coord: { q: 0, r: 0 },
        terrain: 'neutral',
        visibility: 'hidden',
      });
      createTile({
        coord: { q: 1, r: 0 },
        terrain: 'void',
        visibility: 'hidden',
      });

      // Non-tile entity
      createUnit('void-seekers', 'cultist', { q: 0, r: 0 });

      expect([...tiles].length).toBe(2);
    });

    it('selectedUnits archetype queries selected units', () => {
      const unit1 = createUnit('void-seekers', 'cultist', { q: 0, r: 0 });
      const unit2 = createUnit('flesh-weavers', 'priest', { q: 1, r: 0 });

      // Select only one unit
      unit1.selected = true;

      expect([...selectedUnits].length).toBe(1);
      expect([...selectedUnits][0]?.id).toBe(unit1.id);

      // Also select second unit
      unit2.selected = true;

      expect([...selectedUnits].length).toBe(2);
    });

    it('aiControlled archetype queries AI units', () => {
      const unit1 = createUnit('void-seekers', 'cultist', { q: 0, r: 0 });
      const unit2 = createUnit('flesh-weavers', 'priest', { q: 1, r: 0 });

      unit2.aiControlled = true;

      expect([...aiControlled].length).toBe(1);
      expect([...aiControlled][0]?.id).toBe(unit2.id);
    });

    it('movingEntities archetype queries moving entities', () => {
      const unit = createUnit('void-seekers', 'cultist', { q: 0, r: 0 });

      // Initially the unit is in movingEntities (has transform and movement)
      expect([...movingEntities].length).toBe(1);
    });
  });

  describe('removeEntity', () => {
    it('removes entity from world', () => {
      const unit = createUnit('void-seekers', 'cultist', { q: 0, r: 0 });
      expect(world.entities.length).toBe(1);

      removeEntity(unit);
      expect(world.entities.length).toBe(0);
    });

    it('removes entity from archetypes', () => {
      const unit = createUnit('void-seekers', 'cultist', { q: 0, r: 0 });
      expect([...units].length).toBe(1);

      removeEntity(unit);
      expect([...units].length).toBe(0);
    });
  });
});
