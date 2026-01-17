import type { ArcRotateCamera, Scene } from '@babylonjs/core';
import { Color3, MeshBuilder, StandardMaterial } from '@babylonjs/core';
import { hexesInRange, hexToWorld } from '@cosmic-cults/core';
import {
  BabylonCanvas,
  createTile,
  GameProvider,
  useFPS,
  useGameStore,
  useKeyboardShortcuts,
} from '@cosmic-cults/game';
import type { Tile } from '@cosmic-cults/types';
import { useCallback } from 'react';

/**
 * Main game component
 */
function Game() {
  const { fps, tick } = useFPS();
  const turn = useGameStore((state) => state.turn);
  const currentFaction = useGameStore((state) => state.currentFaction);
  const phase = useGameStore((state) => state.phase);
  const showGrid = useGameStore((state) => state.showGrid);
  const isPaused = useGameStore((state) => state.isPaused);

  // Set up keyboard shortcuts
  useKeyboardShortcuts();

  const handleSceneReady = useCallback(
    (scene: Scene, _camera: ArcRotateCamera) => {
      // Create hex grid
      const radius = 5;
      const hexes = hexesInRange({ q: 0, r: 0 }, radius);

      hexes.forEach((hex) => {
        // Create tile entity
        const terrain = getRandomTerrain();
        const tile: Tile = {
          coord: hex,
          terrain,
          visibility: 'visible',
        };
        createTile(tile);

        // Create visual mesh
        const worldPos = hexToWorld(hex);
        const hexMesh = MeshBuilder.CreateCylinder(
          `hex-${hex.q}-${hex.r}`,
          {
            diameter: 1.0,
            height: 0.1,
            tessellation: 6,
          },
          scene,
        );

        hexMesh.position.set(worldPos.x, 0, worldPos.z);
        hexMesh.rotation.y = Math.PI / 6; // Rotate to pointy-top

        // Color based on terrain
        const material = new StandardMaterial(
          `hex-material-${hex.q}-${hex.r}`,
          scene,
        );
        material.diffuseColor = getTerrainColor(terrain);
        hexMesh.material = material;
      });
    },
    [],
  );

  const handleRender = useCallback(
    (_scene: Scene, _deltaTime: number) => {
      tick();
    },
    [tick],
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <BabylonCanvas
        onSceneReady={handleSceneReady}
        onRender={handleRender}
        backgroundColor="#0a0a12"
      />

      {/* HUD overlay */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: 14,
          userSelect: 'none',
        }}
      >
        <div>
          Turn {turn} - {currentFaction.replace('-', ' ').toUpperCase()}
        </div>
        <div>Phase: {phase}</div>
        <div>FPS: {fps}</div>
        {isPaused && <div style={{ color: '#ff6b6b' }}>PAUSED</div>}
        {showGrid && <div style={{ color: '#888' }}>Grid: ON</div>}
      </div>

      {/* Controls help */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          color: '#888',
          fontFamily: 'monospace',
          fontSize: 12,
          textAlign: 'right',
          userSelect: 'none',
        }}
      >
        <div>SPACE - Pause | G - Toggle Grid</div>
        <div>ENTER - Next Turn | ESC - Clear Selection</div>
      </div>
    </div>
  );
}

/**
 * Get random terrain type
 */
function getRandomTerrain(): Tile['terrain'] {
  const terrains: Tile['terrain'][] = [
    'neutral',
    'corrupted',
    'sanctified',
    'void',
  ];
  const weights = [0.6, 0.15, 0.15, 0.1];
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i] ?? 0;
    if (random < sum) return terrains[i] ?? 'neutral';
  }
  return 'neutral';
}

/**
 * Get color for terrain type
 */
function getTerrainColor(terrain: Tile['terrain']): Color3 {
  switch (terrain) {
    case 'void':
      return new Color3(0.1, 0.05, 0.15);
    case 'corrupted':
      return new Color3(0.3, 0.1, 0.2);
    case 'sanctified':
      return new Color3(0.9, 0.85, 0.7);
    default:
      return new Color3(0.4, 0.35, 0.3);
  }
}

/**
 * App wrapper with providers
 */
export default function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
