/**
 * Hex Grid Diorama Rendering System
 *
 * Uses BabylonJS thin instances for performant hex tile rendering
 * Supports terrain types, elevation, and fog of war
 */

import {
  Color3,
  Matrix,
  type Mesh,
  MeshBuilder,
  type Scene,
  VertexBuffer,
} from '@babylonjs/core';
import { CellMaterial } from '@babylonjs/materials';
import { HEX_SIZE, hexesInRange, hexToWorld } from '@cosmic-cults/core';
import type { HexCoord, TerrainType, Visibility } from '@cosmic-cults/types';

// Hex mesh template cache
let hexMeshTemplate: Mesh | null = null;
const terrainMaterials: Map<TerrainType, CellMaterial> = new Map();
let fogMesh: Mesh | null = null;

// Tile data for rendering
export interface TileRenderData {
  coord: HexCoord;
  terrain: TerrainType;
  elevation: number;
  visibility: Visibility;
  corruption?: number;
}

// Chunk system for streaming
export interface HexChunk {
  center: HexCoord;
  radius: number;
  mesh: Mesh | null;
  tiles: TileRenderData[];
  loaded: boolean;
}

// Grid state
const chunks: Map<string, HexChunk> = new Map();
let activeScene: Scene | null = null;

/**
 * Initialize the hex grid system
 */
export function initializeHexGrid(scene: Scene): void {
  activeScene = scene;
  createHexMeshTemplate(scene);
  createTerrainMaterials(scene);
  createFogMesh(scene);
}

/**
 * Create the base hex mesh template (pointy-top orientation)
 */
function createHexMeshTemplate(scene: Scene): void {
  // Create a hexagon using CreateCylinder with 6 sides
  hexMeshTemplate = MeshBuilder.CreateCylinder(
    'hexTemplate',
    {
      height: 0.3,
      diameter: HEX_SIZE * 2 * 0.95, // Slightly smaller for gaps
      tessellation: 6,
    },
    scene,
  );

  // Rotate to pointy-top orientation
  hexMeshTemplate.rotation.y = Math.PI / 6;

  // Make it a template (not rendered directly)
  hexMeshTemplate.setEnabled(false);
  hexMeshTemplate.isVisible = false;
}

/**
 * Create cel-shaded terrain materials
 */
function createTerrainMaterials(scene: Scene): void {
  const terrainColors: Record<TerrainType, { base: string; emissive: string }> =
    {
      void: { base: '#1a0a2e', emissive: '#0d0019' },
      corrupted: { base: '#4d1a33', emissive: '#1a000d' },
      sanctified: { base: '#e6d9b3', emissive: '#1a1408' },
      neutral: { base: '#665c4d', emissive: '#000000' },
    };

  for (const [terrain, colors] of Object.entries(terrainColors)) {
    const material = new CellMaterial(`terrain-${terrain}`, scene);
    material.diffuseColor = Color3.FromHexString(colors.base);
    material.computeHighLevel = true;
    terrainMaterials.set(terrain as TerrainType, material);
  }
}

/**
 * Create fog of war mesh
 */
function createFogMesh(scene: Scene): void {
  fogMesh = MeshBuilder.CreateCylinder(
    'fogTemplate',
    {
      height: 0.1,
      diameter: HEX_SIZE * 2 * 0.98,
      tessellation: 6,
    },
    scene,
  );

  fogMesh.rotation.y = Math.PI / 6;
  fogMesh.setEnabled(false);
  fogMesh.isVisible = false;

  // Create fog material
  const fogMaterial = new CellMaterial('fog', scene);
  fogMaterial.diffuseColor = new Color3(0.02, 0.02, 0.05);
  fogMaterial.alpha = 0.8;
  fogMesh.material = fogMaterial;
}

/**
 * Generate a chunk key from coordinates
 */
function getChunkKey(center: HexCoord): string {
  return `${center.q},${center.r}`;
}

/**
 * Create a hex grid chunk with thin instances
 */
export function createChunk(
  center: HexCoord,
  radius: number,
  tiles: TileRenderData[],
): HexChunk {
  if (!activeScene || !hexMeshTemplate) {
    throw new Error('Hex grid not initialized');
  }

  const chunkKey = getChunkKey(center);

  // Return existing chunk if already loaded
  const existing = chunks.get(chunkKey);
  if (existing?.loaded) {
    return existing;
  }

  // Group tiles by terrain type for efficient batching
  const tilesByTerrain = new Map<TerrainType, TileRenderData[]>();
  for (const tile of tiles) {
    if (!tilesByTerrain.has(tile.terrain)) {
      tilesByTerrain.set(tile.terrain, []);
    }
    tilesByTerrain.get(tile.terrain)?.push(tile);
  }

  // Create mesh for each terrain type using thin instances
  const chunkMeshes: Mesh[] = [];

  for (const [terrain, terrainTiles] of tilesByTerrain) {
    if (terrainTiles.length === 0) continue;

    // Clone template for this terrain
    const terrainMesh = hexMeshTemplate.clone(`chunk-${chunkKey}-${terrain}`);
    if (!terrainMesh) continue;

    terrainMesh.setEnabled(true);
    terrainMesh.isVisible = true;
    terrainMesh.material = terrainMaterials.get(terrain) || null;

    // Create instance matrices
    const matrices: Matrix[] = [];
    for (const tile of terrainTiles) {
      const worldPos = hexToWorld(tile.coord);
      const matrix = Matrix.Translation(
        worldPos.x,
        tile.elevation * 0.3, // Elevation multiplier
        worldPos.z,
      );
      matrices.push(matrix);
    }

    // Apply thin instances
    if (matrices.length > 0) {
      const matrixData = new Float32Array(matrices.length * 16);
      for (let i = 0; i < matrices.length; i++) {
        const matrix = matrices[i];
        if (matrix) {
          matrix.copyToArray(matrixData, i * 16);
        }
      }
      terrainMesh.thinInstanceSetBuffer('matrix', matrixData, 16);
    }

    chunkMeshes.push(terrainMesh);
  }

  // Create fog instances for hidden/revealed tiles
  const fogTiles = tiles.filter(
    (t) => t.visibility === 'hidden' || t.visibility === 'revealed',
  );
  let fogChunkMesh: Mesh | null = null;

  if (fogTiles.length > 0 && fogMesh) {
    fogChunkMesh = fogMesh.clone(`fog-${chunkKey}`);
    if (fogChunkMesh) {
      fogChunkMesh.setEnabled(true);
      fogChunkMesh.isVisible = true;

      const fogMatrices: Matrix[] = [];
      const fogAlphas: number[] = [];

      for (const tile of fogTiles) {
        const worldPos = hexToWorld(tile.coord);
        const matrix = Matrix.Translation(
          worldPos.x,
          (tile.elevation + 1) * 0.3 + 0.05, // Slightly above terrain
          worldPos.z,
        );
        fogMatrices.push(matrix);
        fogAlphas.push(tile.visibility === 'hidden' ? 1.0 : 0.5);
      }

      if (fogMatrices.length > 0 && activeScene) {
        const matrixData = new Float32Array(fogMatrices.length * 16);
        for (let i = 0; i < fogMatrices.length; i++) {
          const matrix = fogMatrices[i];
          if (matrix) {
            matrix.copyToArray(matrixData, i * 16);
          }
        }
        fogChunkMesh.thinInstanceSetBuffer('matrix', matrixData, 16);

        // Per-instance alpha (requires custom vertex attribute)
        const alphaData = new Float32Array(fogAlphas);
        fogChunkMesh.setVerticesBuffer(
          new VertexBuffer(
            activeScene.getEngine(),
            alphaData,
            'fogAlpha',
            false,
            false,
            1,
            true,
          ),
        );
      }

      chunkMeshes.push(fogChunkMesh);
    }
  }

  // Merge chunk meshes for performance (optional)
  const chunk: HexChunk = {
    center,
    radius,
    mesh: chunkMeshes[0] || null, // Reference first mesh
    tiles,
    loaded: true,
  };

  chunks.set(chunkKey, chunk);
  return chunk;
}

/**
 * Generate terrain for a hex area
 */
export function generateTerrain(
  center: HexCoord,
  radius: number,
  seed: number = Date.now(),
): TileRenderData[] {
  const hexes = hexesInRange(center, radius);
  const tiles: TileRenderData[] = [];

  // Simple procedural generation using noise-like function
  const noise = (x: number, y: number) => {
    const val = Math.sin(x * 0.1 + seed) * Math.cos(y * 0.1 + seed * 0.7);
    return (val + 1) / 2; // Normalize to 0-1
  };

  for (const hex of hexes) {
    const n = noise(hex.q, hex.r);

    // Determine terrain type based on noise
    let terrain: TerrainType;
    if (n < 0.2) {
      terrain = 'void';
    } else if (n < 0.4) {
      terrain = 'corrupted';
    } else if (n > 0.85) {
      terrain = 'sanctified';
    } else {
      terrain = 'neutral';
    }

    // Elevation based on noise
    const elevation = Math.floor(noise(hex.q * 2, hex.r * 2) * 3);

    tiles.push({
      coord: hex,
      terrain,
      elevation,
      visibility: 'hidden', // Start hidden
      corruption: terrain === 'corrupted' ? n * 100 : undefined,
    });
  }

  return tiles;
}

/**
 * Update fog of war visibility
 */
export function updateVisibility(
  visibleHexes: HexCoord[],
  revealedHexes: HexCoord[],
): void {
  const visibleSet = new Set(visibleHexes.map((h) => `${h.q},${h.r}`));
  const revealedSet = new Set(revealedHexes.map((h) => `${h.q},${h.r}`));

  for (const chunk of chunks.values()) {
    for (const tile of chunk.tiles) {
      const key = `${tile.coord.q},${tile.coord.r}`;
      if (visibleSet.has(key)) {
        tile.visibility = 'visible';
      } else if (revealedSet.has(key)) {
        tile.visibility = 'revealed';
      }
      // Keep 'hidden' for others
    }
  }
}

/**
 * Get tile at hex coordinate
 */
export function getTileAt(coord: HexCoord): TileRenderData | null {
  for (const chunk of chunks.values()) {
    for (const tile of chunk.tiles) {
      if (tile.coord.q === coord.q && tile.coord.r === coord.r) {
        return tile;
      }
    }
  }
  return null;
}

/**
 * Unload a chunk
 */
export function unloadChunk(center: HexCoord): void {
  const key = getChunkKey(center);
  const chunk = chunks.get(key);

  if (chunk?.mesh) {
    chunk.mesh.dispose();
    chunk.mesh = null;
    chunk.loaded = false;
  }

  chunks.delete(key);
}

/**
 * Dispose all hex grid resources
 */
export function disposeHexGrid(): void {
  for (const chunk of chunks.values()) {
    if (chunk.mesh) {
      chunk.mesh.dispose();
    }
  }
  chunks.clear();

  if (hexMeshTemplate) {
    hexMeshTemplate.dispose();
    hexMeshTemplate = null;
  }

  if (fogMesh) {
    fogMesh.dispose();
    fogMesh = null;
  }

  for (const material of terrainMaterials.values()) {
    material.dispose();
  }
  terrainMaterials.clear();

  activeScene = null;
}

/**
 * Get statistics about loaded chunks
 */
export function getChunkStats(): {
  totalChunks: number;
  loadedChunks: number;
  totalTiles: number;
} {
  let loadedChunks = 0;
  let totalTiles = 0;

  for (const chunk of chunks.values()) {
    if (chunk.loaded) loadedChunks++;
    totalTiles += chunk.tiles.length;
  }

  return {
    totalChunks: chunks.size,
    loadedChunks,
    totalTiles,
  };
}

/**
 * Create a hex grid visualization for debugging
 */
export function createDebugGrid(scene: Scene, radius: number = 5): Mesh {
  if (!hexMeshTemplate) {
    createHexMeshTemplate(scene);
  }

  const hexes = hexesInRange({ q: 0, r: 0 }, radius);
  const debugMesh = hexMeshTemplate?.clone('debugGrid');

  if (!debugMesh) {
    throw new Error('Failed to create debug grid');
  }

  debugMesh.setEnabled(true);
  debugMesh.isVisible = true;

  const material = new CellMaterial('debug', scene);
  material.diffuseColor = new Color3(0.3, 0.3, 0.3);
  debugMesh.material = material;

  const matrices: Matrix[] = [];
  for (const hex of hexes) {
    const worldPos = hexToWorld(hex);
    matrices.push(Matrix.Translation(worldPos.x, 0, worldPos.z));
  }

  const matrixData = new Float32Array(matrices.length * 16);
  for (let i = 0; i < matrices.length; i++) {
    const matrix = matrices[i];
    if (matrix) {
      matrix.copyToArray(matrixData, i * 16);
    }
  }
  debugMesh.thinInstanceSetBuffer('matrix', matrixData, 16);

  return debugMesh;
}
