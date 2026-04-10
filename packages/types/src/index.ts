/**
 * Core type definitions for Cosmic Cults
 */

// Hex coordinate system (axial coordinates)
export interface HexCoord {
  q: number;
  r: number;
}

// Cube coordinates for hex grid math
export interface CubeCoord {
  x: number;
  y: number;
  z: number;
}

// 3D world position
export interface WorldPosition {
  x: number;
  y: number;
  z: number;
}

// Faction identifiers
export type FactionId = 'void-seekers' | 'flesh-weavers' | 'star-children';

// Faction colors
export const FACTION_COLORS: Record<FactionId, string> = {
  'void-seekers': '#7B2CBF',
  'flesh-weavers': '#E63946',
  'star-children': '#FFD700',
} as const;

// Unit types
export type UnitType = 'cultist' | 'acolyte' | 'priest' | 'avatar';

// Base entity interface (ECS compatible)
export interface Entity {
  id: string;
}

// Transform component
export interface Transform {
  position: WorldPosition;
  rotation: number;
  scale: number;
}

// Health component
export interface Health {
  current: number;
  max: number;
}

// Movement component
export interface Movement {
  speed: number;
  destination?: HexCoord;
}

// Unit component
export interface Unit {
  faction: FactionId;
  type: UnitType;
}

// Fog of war visibility states
export type Visibility = 'hidden' | 'revealed' | 'visible';

// Tile component
export interface Tile {
  coord: HexCoord;
  terrain: TerrainType;
  visibility: Visibility;
  corruption?: number;
}

// Terrain types
export type TerrainType = 'void' | 'corrupted' | 'sanctified' | 'neutral';

// Camera configuration
export interface CameraConfig {
  fov: number;
  near: number;
  far: number;
  position: WorldPosition;
  target: WorldPosition;
}

// Game state
export interface GameState {
  turn: number;
  currentFaction: FactionId;
  phase: GamePhase;
}

export type GamePhase = 'exploration' | 'combat' | 'ritual';
