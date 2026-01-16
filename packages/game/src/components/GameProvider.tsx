/**
 * GameProvider - Context provider for game state
 *
 * Combines ECS world with Zustand store for UI state
 */

import type { FactionId, GamePhase, HexCoord } from '@cosmic-cults/types';
import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useEffect,
} from 'react';
import { create } from 'zustand';
import type { GameEntity } from '../ecs';
import { selectedUnits, tiles, units, world } from '../ecs';

// UI State interface
export interface GameUIState {
  // Camera
  cameraTarget: HexCoord;
  zoomLevel: number;

  // Selection
  selectedUnitIds: string[];

  // Game state
  currentFaction: FactionId;
  turn: number;
  phase: GamePhase;

  // UI toggles
  showGrid: boolean;
  showFogOfWar: boolean;
  isPaused: boolean;

  // Actions
  setCameraTarget: (target: HexCoord) => void;
  setZoomLevel: (level: number) => void;
  selectUnits: (unitIds: string[]) => void;
  clearSelection: () => void;
  toggleUnit: (unitId: string) => void;
  setPhase: (phase: GamePhase) => void;
  nextTurn: () => void;
  toggleGrid: () => void;
  toggleFogOfWar: () => void;
  togglePause: () => void;
}

// Create Zustand store
export const useGameStore = create<GameUIState>((set) => ({
  // Initial state
  cameraTarget: { q: 0, r: 0 },
  zoomLevel: 1,
  selectedUnitIds: [],
  currentFaction: 'void-seekers',
  turn: 1,
  phase: 'exploration',
  showGrid: true,
  showFogOfWar: true,
  isPaused: false,

  // Actions
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
  selectUnits: (unitIds) => set({ selectedUnitIds: unitIds }),
  clearSelection: () => set({ selectedUnitIds: [] }),
  toggleUnit: (unitId) =>
    set((state) => ({
      selectedUnitIds: state.selectedUnitIds.includes(unitId)
        ? state.selectedUnitIds.filter((id) => id !== unitId)
        : [...state.selectedUnitIds, unitId],
    })),
  setPhase: (phase) => set({ phase }),
  nextTurn: () =>
    set((state) => {
      const factions: FactionId[] = [
        'void-seekers',
        'flesh-weavers',
        'star-children',
      ];
      const currentIndex = factions.indexOf(state.currentFaction);
      const nextIndex = (currentIndex + 1) % factions.length;
      const newTurn = nextIndex === 0 ? state.turn + 1 : state.turn;
      return {
        currentFaction: factions[nextIndex] as FactionId,
        turn: newTurn,
        phase: 'exploration',
      };
    }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleFogOfWar: () => set((state) => ({ showFogOfWar: !state.showFogOfWar })),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}));

// Game context for ECS access
interface GameContextValue {
  world: typeof world;
  units: typeof units;
  tiles: typeof tiles;
  selectedUnits: typeof selectedUnits;
}

const GameContext = createContext<GameContextValue | null>(null);

export interface GameProviderProps {
  children: ReactNode;
}

/**
 * Game provider component
 */
export const GameProvider: FC<GameProviderProps> = ({ children }) => {
  // Sync ECS selection with Zustand store
  const selectedUnitIds = useGameStore((state) => state.selectedUnitIds);

  useEffect(() => {
    // Update ECS selected flag based on store
    for (const entity of units) {
      const shouldBeSelected = selectedUnitIds.includes(entity.id);
      if (entity.selected !== shouldBeSelected) {
        world.addComponent(entity, 'selected', shouldBeSelected);
      }
    }
  }, [selectedUnitIds]);

  const contextValue: GameContextValue = {
    world,
    units,
    tiles,
    selectedUnits,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

/**
 * Hook to access game ECS world
 */
export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

/**
 * Hook to get entities at a hex coordinate
 */
export function useEntitiesAtHex(coord: HexCoord): GameEntity[] {
  const { units } = useGame();
  return [...units].filter((entity) => {
    // Check if entity is at the specified hex
    // This will need proper hex-to-world coordinate checking
    return (
      entity.transform?.position.x === coord.q &&
      entity.transform?.position.z === coord.r
    );
  });
}
