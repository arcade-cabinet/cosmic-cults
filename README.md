---
title: Cosmic Cults
updated: 2026-04-09
status: current
domain: product
---

# Cosmic Cults

A Lovecraftian 4X real-time strategy game. Three cults compete for dominion over a corrupted hex-tile world. Built on React Native (Expo SDK 54) + BabylonJS, targeting both mobile and web.

Licensed under MIT or Apache-2.0 at your option.

## What It Is

- Isometric hex-grid RTS with fog of war and corruption mechanics
- Three playable factions: Void Seekers, Flesh Weavers, Star Children
- Procedurally generated terrain with elevation and terrain type variation
- Cel-shaded Lovecraftian visual style
- Shared codebase for iOS, Android, and browser play

## Project Status

The TypeScript + BabylonJS implementation is in active development. The hex grid foundation, ECS layer, isometric camera, cel-shaded materials, and RecastJS navigation are implemented. See `docs/STATE.md` for current progress.

## Prerequisites

- Node.js 22+
- pnpm 10+ (`npm install -g pnpm`)
- For mobile: Expo CLI (`npm install -g expo-cli`) and a physical device or simulator

## Getting Started

```bash
# Install dependencies
pnpm install

# Run web dev server (BabylonJS, Vite)
pnpm dev

# Run mobile dev server (Expo)
pnpm dev:mobile
```

Open the web app at `http://localhost:5173`. For mobile, scan the QR code with the Expo Go app or run on a connected device.

## Build

```bash
# Web production build
pnpm build

# Mobile — preview build (EAS)
pnpm --filter @cosmic-cults/mobile build:preview

# Mobile — production build (EAS)
pnpm --filter @cosmic-cults/mobile build:production
```

## Testing and Quality

```bash
pnpm test              # unit tests (Vitest + fast-check)
pnpm test:coverage     # with coverage report
pnpm lint              # Biome lint check
pnpm format            # Biome auto-fix
pnpm check             # TypeScript type check across all packages
```

## Package Structure

| Package | Description |
|---------|-------------|
| `@cosmic-cults/types` | Shared TypeScript types |
| `@cosmic-cults/config` | Game constants and configuration |
| `@cosmic-cults/core` | Hex grid math and utilities |
| `@cosmic-cults/engine` | BabylonJS camera, materials, scene |
| `@cosmic-cults/ecs` | Miniplex ECS world and archetypes |
| `@cosmic-cults/game` | BabylonJS game integration |
| `@cosmic-cults/navigation` | RecastJS navmesh pathfinding |
| `@cosmic-cults/procedural` | Terrain feature generation |
| `@cosmic-cults/store` | Zustand UI state |
| `@cosmic-cults/ui` | HUD, dialogs, minimap, toast |
| `@cosmic-cults/web` | Vite web app |
| `@cosmic-cults/mobile` | Expo SDK 54 mobile app |

## Contributing

1. Read `CLAUDE.md` and `AGENTS.md` for project rules and architecture.
2. Create a branch: `git checkout -b feat/your-feature`.
3. Keep files under 300 lines. Write tests for new logic.
4. Ensure `pnpm test && pnpm lint && pnpm check` all pass.
5. Open a pull request — CI must be green before merging.

Conventional Commits are required: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.

## License

Licensed under either of Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE)) or MIT license ([LICENSE-MIT](LICENSE-MIT)) at your option.
