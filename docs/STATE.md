---
title: Project State
updated: 2026-04-09
status: current
domain: context
---

# Project State

## Current Status

**Migration phase:** Task 01 complete. Task 02 (hex grid system) is next.
**Active branch:** `release/1.0-migration`

## What Is Done

### Task 01: BabylonJS Migration Foundation (complete)

- pnpm 10 workspace with Biome 2.x linting
- `@cosmic-cults/types` — all shared TypeScript types
- `@cosmic-cults/core` — hex grid math (axial, cube, world coordinates)
- `@cosmic-cults/engine` — isometric camera, cel-shaded materials, scene management
- `@cosmic-cults/ecs` — Miniplex world, archetypes, factories, 16+ passing tests
- `@cosmic-cults/game` — BabylonJS hex grid diorama, chunk system, fog of war
- `@cosmic-cults/navigation` — RecastJS navmesh singleton
- `@cosmic-cults/procedural` — terrain feature generation with seeded RNG
- `@cosmic-cults/store` — Zustand game UI state
- `@cosmic-cults/mobile` — Expo SDK 54 + `@babylonjs/react-native` app skeleton
- `@cosmic-cults/web` — Vite dev app with hex grid visualization
- Property-based tests with fast-check

### Infrastructure (complete)

- Workspace restructured from scattered `apps/` layout to unified `packages/`
- Dependency triage: all packages on latest compatible versions
- Legacy Rust/Bevy code preserved in `docs/legacy/` (read-only)
- GitHub issues #9, #10, #12 closed as obsolete

## What Is Next

### Task 02: Hex Grid System

- Create hexagonal diorama with all terrain types rendered correctly
- Implement chunk-based streaming for large maps
- Add thin instances for tile rendering performance
- Create terrain material variations with corruption visual effects
- Verify 60 FPS on mobile with a radius-10 grid

### Task 03: Unit System (planned)

- Unit mesh loading from GLB assets
- Movement commands via navmesh
- Faction color differentiation on unit materials
- Selection highlight

### Task 04: Fog of War (planned)

- Visibility radius per unit
- Revealed vs. hidden tile state persistence
- Fog overlay updates on unit movement

### Task 05: Combat System (planned)

- Range calculation using hex distance
- Damage model per unit type
- XP and veteran tiers

## Blocking Issues

- PR #42 awaiting human merge (CI sync from control-center)

## Key Technical Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Mobile framework | React Native + Expo | True native performance over Capacitor |
| 3D engine | BabylonJS | Better built-in navigation/AI tools than Three.js |
| ECS | Miniplex | Lightweight, React-friendly |
| Navigation | RecastJS | Navigation Plugin V2, better than YukaJS |
| Hex orientation | Pointy-top | Better for isometric view |
| Linting | Biome | Faster than ESLint + Prettier, single tool |

## Reference Projects

- `../wheres-ball-though` — React Native + Expo patterns
- `../neo-tokyo-rival-academies` — BabylonJS + Reactylon patterns
