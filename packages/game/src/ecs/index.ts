/**
 * ECS (Entity Component System) setup using Miniplex
 *
 * Provides type-safe entity management for game objects
 */

import type {
  Entity,
  FactionId,
  Health,
  HexCoord,
  Movement,
  Tile,
  Transform,
  Unit,
  UnitType,
} from '@cosmic-cults/types';
import { World } from 'miniplex';

// Extended entity with all possible components
export interface GameEntity extends Entity {
  // Core components
  transform?: Transform;
  health?: Health;
  movement?: Movement;

  // Unit components
  unit?: Unit;
  selected?: boolean;
  targetable?: boolean;

  // World components
  tile?: Tile;

  // Visual components
  meshId?: string;
  visible?: boolean;

  // AI components
  aiControlled?: boolean;
  pathQueue?: HexCoord[];
}

// Create the world singleton
export const world = new World<GameEntity>();

// Archetypes for common entity queries
export const units = world.with('transform', 'unit', 'health');
export const tiles = world.with('tile');
export const selectedUnits = world.with('unit', 'selected');
export const movingEntities = world.with('transform', 'movement');
export const aiControlled = world.with('unit', 'aiControlled');
export const visibleEntities = world.with('transform', 'visible');

/**
 * Create a new unit entity
 */
export function createUnit(
  faction: FactionId,
  type: UnitType,
  _position: HexCoord,
): GameEntity {
  const entity = world.add({
    id: crypto.randomUUID(),
    transform: {
      position: { x: 0, y: 0, z: 0 }, // Will be set by hex-to-world conversion
      rotation: 0,
      scale: 1,
    },
    health: {
      current: getUnitMaxHealth(type),
      max: getUnitMaxHealth(type),
    },
    movement: {
      speed: getUnitSpeed(type),
    },
    unit: {
      faction,
      type,
    },
    selected: false,
    targetable: true,
    visible: true,
    aiControlled: false,
  });

  return entity;
}

/**
 * Create a new tile entity
 */
export function createTile(tile: Tile): GameEntity {
  return world.add({
    id: `tile-${tile.coord.q}-${tile.coord.r}`,
    tile,
    visible: true,
  });
}

/**
 * Remove an entity from the world
 */
export function removeEntity(entity: GameEntity): void {
  world.remove(entity);
}

/**
 * Get max health for a unit type
 */
function getUnitMaxHealth(type: UnitType): number {
  const healthMap: Record<UnitType, number> = {
    cultist: 50,
    acolyte: 75,
    priest: 100,
    avatar: 500,
  };
  return healthMap[type];
}

/**
 * Get movement speed for a unit type
 */
function getUnitSpeed(type: UnitType): number {
  const speedMap: Record<UnitType, number> = {
    cultist: 4,
    acolyte: 3,
    priest: 2,
    avatar: 1,
  };
  return speedMap[type];
}

// Re-export World type for external use
export type { World };
