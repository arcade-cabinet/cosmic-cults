# Tasks: Cosmic Cults 1.0 Migration

**Spec:** [requirements.md](requirements.md) | **Design:** [design.md](design.md)

## Overview

This document tracks all tasks for the Rust/Bevy to React Native/BabylonJS migration. Tasks are organized into phases with dependencies clearly marked.

## Task Index

| # | Task | Status | Validates |
|---|------|--------|-----------|
| 01 | [BabylonJS Migration Foundation](tasks/01-babylon-migration.md) | 🟢 Complete | Req 1 |
| 02 | [Hex Grid Diorama System](tasks/02-hex-grid-diorama.md) | 🔴 Not Started | Req 2 |
| 03 | [Navigation and AI System](tasks/03-navigation-ai.md) | 🔴 Not Started | Req 3 |
| 04 | [Cult Faction System](tasks/04-cult-factions.md) | 🔴 Not Started | Req 4 |
| 05 | [Unit and Combat System](tasks/05-unit-combat.md) | 🔴 Not Started | Req 5 |
| 06 | [Fog of War System](tasks/06-fog-of-war.md) | 🔴 Not Started | Req 6 |
| 07 | [Procedural Asset Pipeline](tasks/07-asset-pipeline.md) | 🔴 Not Started | Req 7 |
| 08 | [Mobile Deployment](tasks/08-mobile-deployment.md) | 🔴 Not Started | Req 8 |
| 09 | [Save System](tasks/09-save-system.md) | 🔴 Not Started | Req 9 |
| 10 | [Audio System](tasks/10-audio-system.md) | 🔴 Not Started | Req 10 |
| 11 | [Performance Optimization](tasks/11-performance.md) | 🔴 Not Started | Req 11 |
| 12 | [Testing and QA](tasks/12-testing-qa.md) | 🔴 Not Started | Req 12, 13 |

## Dependency Graph

```
Phase 1: Foundation
├── 01-babylon-migration (independent)
└── 02-hex-grid-diorama (depends on 01)
    └── 03-navigation-ai (depends on 02)

Phase 2: Core Systems
├── 04-cult-factions (depends on 01)
├── 05-unit-combat (depends on 03, 04)
└── 06-fog-of-war (depends on 02)

Phase 3: Features
├── 07-asset-pipeline (depends on 01)
├── 08-mobile-deployment (depends on 01)
└── 09-save-system (depends on 05, 06)

Phase 4: Polish
├── 10-audio-system (depends on 05)
├── 11-performance (depends on all)
└── 12-testing-qa (depends on all)
```

## Status Legend

- 🔴 Not Started
- 🟡 In Progress
- 🟢 Complete
- 🔵 Blocked

## Progress Summary

| Phase | Tasks | Complete | Progress |
|-------|-------|----------|----------|
| 1: Foundation | 3 | 1 | 33% |
| 2: Core Systems | 3 | 0 | 0% |
| 3: Features | 3 | 0 | 0% |
| 4: Polish | 3 | 0 | 0% |
| **Total** | **12** | **1** | **8%** |

## Quick Start

```bash
# Setup development environment
pnpm install

# Start mobile development
pnpm --filter @cosmic-cults/mobile dev

# Run tests
pnpm test

# Lint code
pnpm lint
```

## Notes

- Preserve Rust game design documents in `docs/legacy/` for reference
- Port ECS components from Bevy to Miniplex maintaining same abstractions
- GLB assets from Meshy AI should be validated before committing
- Performance profiling required after each major system implementation
