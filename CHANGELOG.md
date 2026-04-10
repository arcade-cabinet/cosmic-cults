---
title: Changelog
updated: 2026-04-09
status: current
domain: context
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- `packages/ecs/` — Miniplex ECS world, archetypes, factories, and property-based tests
- `packages/engine/` — BabylonJS isometric camera, cel-shaded materials, scene management
- `packages/navigation/` — RecastJS navmesh integration with singleton pattern
- `packages/procedural/` — Terrain feature generation (rocks, pillars, crystals, altars, obelisks, ruins)
- `packages/store/` — Zustand game UI state with subscribeWithSelector middleware
- `packages/ui/` — HUD, minimap, dialogs, and toast components
- `packages/web/` — Vite web development app with hex grid visualization

### Changed
- Restructured workspace from `apps/` to consolidated `packages/` layout
- Upgraded all dependencies to latest compatible versions (dependency triage)

## [1.0.0-migration] — 2026-01-16

### Added
- Full TypeScript + BabylonJS + React Native migration foundation (Task 01 complete)
- `packages/types/` — shared TypeScript type definitions for all game entities
- `packages/core/` — hex grid math (axial/cube coordinates, pointy-top orientation)
- `packages/game/` — BabylonJS integration: hex grid diorama, chunk streaming, fog of war
- `packages/mobile/` — Expo SDK 54 + `@babylonjs/react-native` mobile app
- pnpm 10 workspace configuration with Biome 2.x linting
- 16 passing property-based tests via fast-check

### Changed
- Migration from Rust/Bevy to React Native + BabylonJS
- Replaced Three.js / React Three Fiber with BabylonJS + Reactylon
- Replaced ESLint + Prettier with Biome
- ECS migrated from Bevy ECS concepts to Miniplex

### Deprecated
- Rust/Bevy codebase (preserved in `docs/legacy/` for design reference only)

## Legacy (Rust/Bevy era)

The following changes predate the TypeScript migration and are summarized from git history:

- Implemented game state save/load with bincode serialization
- Added Avian3D physics-based unit movement and collision avoidance
- Integrated fog of war with unit vision system
- Added centralized asset loading registry
- Built HUD with minimap and build menu
- Implemented A* pathfinding with path smoothing and dynamic recalculation
- Added behavior tree AI, utility AI, and state machine systems
- Integrated sound effects and background music
