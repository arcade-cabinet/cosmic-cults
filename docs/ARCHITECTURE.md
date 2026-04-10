---
title: Architecture
updated: 2026-04-09
status: current
domain: technical
---

# Architecture

## System Overview

Cosmic Cults is a monorepo pnpm workspace. All active code is TypeScript. The Rust/Bevy codebase is archived in `docs/legacy/` for design reference.

```
packages/
├── types/          # shared type definitions — no dependencies
├── config/         # game constants — depends on types
├── core/           # hex grid math — depends on types
├── engine/         # BabylonJS wrappers — depends on types
├── ecs/            # Miniplex ECS — depends on types
├── game/           # game integration — depends on core, engine, ecs, types
├── navigation/     # RecastJS navmesh — depends on types
├── procedural/     # terrain generation — depends on types
├── store/          # Zustand UI state — depends on types
├── ui/             # React components — depends on types, store, game
├── web/            # Vite app — depends on game, ui, core, types
└── mobile/         # Expo app — depends on game, ui, core, types
```

Dependency direction: `types` → `config/core/engine/ecs` → `game/navigation/procedural/store` → `ui` → `web/mobile`

## Hex Grid

The world is a pointy-top hexagonal grid using axial coordinates `(q, r)`.

- **Axial (`HexCoord`)**: stored on ECS entities, used for grid queries.
- **Cube (`CubeCoord`)**: used for distance, rotation, line-drawing math (via `axialToCube`).
- **World (`WorldPosition`)**: BabylonJS 3D coordinates, derived via `hexToWorld`.

Hex size is 1.0 unit (center to corner). The `core` package contains all conversion utilities based on the Red Blob Games reference implementation.

```
hexToWorld(hex, size) → WorldPosition   // axial → 3D
worldToHex(pos, size) → HexCoord        // 3D → axial (snapped)
hexDistance(a, b) → number             // via cube coordinates
hexesInRange(center, radius) → HexCoord[]
hexRing(center, radius) → HexCoord[]
hexLine(a, b) → HexCoord[]
```

## ECS Layer

Miniplex 2.x provides a React-friendly ECS. Entities are plain objects; components are properties.

**Component design rule**: component presence = active. Never set boolean components to `false`; remove them instead.

Key archetypes (pre-defined queries in `packages/ecs/src/archetypes.ts`):

| Archetype | Matches |
|-----------|---------|
| `units` | entities with `unit` component |
| `tiles` | entities with `tile` component |
| `selectedUnits` | entities with `unit` and `selected` |
| `aiControlled` | entities with `unit` and `aiControlled` |
| `movingEntities` | entities with `transform` and `movement` |

Factories in `packages/ecs/src/factories.ts`:
- `createUnit(faction, type, hexCoord)` — creates a unit entity with health, speed, and transform
- `createTile(tile)` — creates a tile entity with deterministic ID `tile-${q}-${r}`

## Rendering

BabylonJS 8.x with the Reactylon React binding.

### Camera

`packages/engine/src/camera/` implements a locked isometric camera:
- `ArcRotateCamera` with orthographic projection
- Fixed alpha (45°) and beta (~35.264°) angles — no rotation allowed
- Horizontal panning only (`panningAxis = Vector3(1, 0, 1)`)
- Zoom adjusts orthographic size, not camera radius

### Materials

Cel-shading via `CellMaterial` from `@babylonjs/materials`. Terrain types map to fixed colors:

| Terrain | Base Color |
|---------|-----------|
| `void` | `#1a0a2e` |
| `corrupted` | `#4d1a33` |
| `sanctified` | `#e6d9b3` |
| `neutral` | `#665c4d` |

### Hex Grid Rendering

`packages/game/src/hexgrid/` uses BabylonJS thin instances for performance:
- One cylinder mesh per terrain type per chunk (not per tile)
- Chunk system: `HexChunk` groups tiles by center + radius
- Fog of war rendered as separate semi-transparent fog instances above terrain
- Chunk streaming: `createChunk()`, `unloadChunk()`, `disposeHexGrid()`

## State Management

Two parallel state systems with no overlap:

**ECS world** (`packages/ecs/src/world.ts`): entity state — positions, health, movement targets, AI flags, tile data.

**Zustand store** (`packages/store/src/game.ts`): UI state — camera target, zoom level, selection IDs, current faction, turn number, game phase, UI toggles (grid, fog, pause).

The store uses `subscribeWithSelector` middleware for reactive subscriptions.

## Navigation

`packages/navigation/` wraps RecastJS via the `recast-navigation` library:
- Singleton pattern: one `RecastJSPlugin` per session
- `initializeNavigation(scene)` — async, initializes Recast WASM once
- `buildNavMesh(meshes, params)` — constructs navmesh from terrain geometry
- `isWalkable(position)` — checks proximity to nearest navmesh point
- Debug visualization via `createNavMeshDebug(scene)`

Default navmesh parameters are tuned for hex terrain: `cs=0.2`, `ch=0.2`, `walkableSlopeAngle=35`.

## Procedural Generation

`packages/procedural/` provides:
- `generateTerrainFeature(type, seed, scene)` — deterministic mesh generation (rock, pillar, crystal, altar, obelisk, ruins) using `SeededRandom`
- `applyVertexNoise(mesh, amplitude, frequency, seed)` — organic deformation
- `createProceduralGround(width, height, subdivisions, seed, scene)`

Simple noise function in `packages/game/src/hexgrid/` uses `Math.sin`/`Math.cos` with seed for terrain type and elevation assignment.

## Mobile vs Web

Both apps share all `packages/` code.

**Web** (`packages/web/`): Vite dev server, standard HTML canvas, `BabylonCanvas` React component.

**Mobile** (`packages/mobile/`): Expo SDK 54 + `@babylonjs/react-native` + `@babylonjs/react-native-iosandroid-0-71`. Expo Router for navigation. EAS Build for CI artifacts.

## Data Flow

```
User Input
    ↓
Zustand store (selection, camera)
    ↓
ECS world mutation (createUnit, removeEntity)
    ↓
BabylonJS scene update (mesh transforms, thin instance matrices)
    ↓
RecastJS navmesh query (pathfinding)
    ↓
ECS movement update (pathQueue on entity)
    ↓
Render loop
```
