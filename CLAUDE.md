---
title: Claude Agent Entry Point
updated: 2026-04-09
status: current
domain: technical
---

# CLAUDE.md

Cosmic Cults is a Lovecraftian 4X real-time strategy game built on React Native (Expo SDK 54) + BabylonJS. The project is mid-migration from a Rust/Bevy codebase. This file contains only project-specific instructions.

## Critical Context

The codebase is in active migration. The TypeScript packages under `packages/` are the active target. Rust code in `docs/legacy/` is reference only — do not modify it.

## Repository Layout

```
cosmic-cults/
├── packages/
│   ├── types/          # @cosmic-cults/types — shared TypeScript types
│   ├── config/         # @cosmic-cults/config — game constants
│   ├── core/           # @cosmic-cults/core — hex grid math
│   ├── engine/         # @cosmic-cults/engine — BabylonJS camera/materials/scene
│   ├── ecs/            # @cosmic-cults/ecs — Miniplex ECS world and archetypes
│   ├── game/           # @cosmic-cults/game — BabylonJS integration, hex grid rendering
│   ├── navigation/     # @cosmic-cults/navigation — RecastJS navmesh
│   ├── procedural/     # @cosmic-cults/procedural — terrain feature generation
│   ├── store/          # @cosmic-cults/store — Zustand UI state
│   ├── ui/             # @cosmic-cults/ui — HUD, dialogs, minimap, toast
│   ├── web/            # @cosmic-cults/web — Vite dev app
│   └── mobile/         # @cosmic-cults/mobile — Expo SDK 54 app
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   ├── TESTING.md
│   ├── STATE.md
│   └── LORE.md
└── memory-bank/        # AI session context (not source of truth for docs)
```

## Development Commands

```bash
pnpm install            # install all workspace dependencies
pnpm dev                # web dev server (Vite)
pnpm dev:mobile         # Expo mobile dev server
pnpm build              # web production build
pnpm test               # vitest across all packages
pnpm test:coverage      # with coverage
pnpm lint               # Biome check
pnpm format             # Biome fix
pnpm check              # TypeScript across all packages
```

## Tech Stack

| Purpose | Technology |
|---------|------------|
| Mobile app | React Native + Expo SDK 54 |
| Web app | Vite + React 19 |
| 3D engine | BabylonJS 8.x + Reactylon |
| ECS | Miniplex 2.x |
| UI state | Zustand 5.x |
| Navigation/AI | RecastJS (via recast-navigation) |
| Linting | Biome 2.x |
| Testing | Vitest + fast-check (property tests) |
| Language | TypeScript 5.9 strict |
| Package manager | pnpm 10+ workspaces |

## Code Rules

- Max 300 LOC per file
- TypeScript strict mode — no `any`, no type assertions without comment
- Miniplex: component presence = truthy; never set boolean components to `false`, omit them instead
- BabylonJS instances must be disposed in cleanup functions
- 60 FPS target on mobile — profile before and after rendering changes

## Reference Projects

- `../wheres-ball-though` — React Native + Expo patterns
- `../neo-tokyo-rival-academies` — BabylonJS + Reactylon patterns
