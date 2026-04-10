---
title: Design
updated: 2026-04-09
status: current
domain: product
---

# Design

## Vision

Cosmic Cults is a real-time strategy game set in a Lovecraftian world where three cults compete for dominion over corrupted hexagonal terrain. The game evokes dread through aesthetic choices: cel-shaded darkness, fog of war hiding unknowable threats, corruption spreading across tiles, and unit types that scale from expendable cultists to reality-warping avatars.

The experience is a diorama — a contained, readable battlefield viewed from a fixed isometric angle. Players command their cult with deliberate clicks, not twitch reactions.

## What It Is

- A hex-grid RTS with three asymmetric factions
- Turn-phase structure: exploration, combat, ritual
- Fog of war that reveals and re-hides as units move
- Corruption mechanic: tiles can be neutral, corrupted, sanctified, or void
- Procedurally generated terrain with elevation and scattered features
- Cel-shaded Lovecraftian visual style

## What It Is Not

- Not a base-builder (no construction of structures, only occupation)
- Not a card game or deck-builder
- Not a narrative adventure — story is emergent from faction conflict
- Not a fast-paced action game — deliberate pacing is intentional

## The Three Factions

### Void Seekers
Color: deep purple (`#7B2CBF`). Worshippers of the void between stars. Units move through corrupted tiles at reduced cost. Avatars warp space, affecting enemy pathfinding.

### Flesh Weavers
Color: crimson (`#E63946`). Biomancers who graft corrupted flesh. Units regenerate health on corrupted terrain. Acolytes can corrupt neutral tiles.

### Star Children
Color: gold (`#FFD700`). Alien-touched cultists who sanctify. Units gain movement speed on sanctified terrain. Priests create sanctified tiles, blocking corruption spread.

## Unit Roster

| Type | Health | Speed | Role |
|------|--------|-------|------|
| Cultist | 50 | 4 | Expendable scout |
| Acolyte | 75 | 3 | Terrain manipulator |
| Priest | 100 | 2 | Support / tile control |
| Avatar | 500 | 1 | Faction ultimate unit |

## Visual Identity

- Cel-shading (`CellMaterial`) throughout — hard edges, no smooth gradients
- Dark palette with high-contrast faction accents
- Fixed isometric camera — no rotation, controlled zoom
- Fog of war as semi-transparent dark overlay on unrevealed tiles
- Terrain features (rocks, pillars, crystals, altars, obelisks, ruins) provide visual interest and block movement

## Game Phases

| Phase | Description |
|-------|-------------|
| Exploration | Units move, reveal fog of war |
| Combat | Units engage enemies in range |
| Ritual | Priests and acolytes perform terrain actions |

Phases cycle per faction turn. All three factions take turns before the global turn counter increments.

## Platform Targets

The game is designed mobile-first:
- Touch input for unit selection and movement commands
- Safe area awareness on notched devices
- 60 FPS target — rendering budget is a hard constraint
- Web version for development and browser-based play

## Design Constraints

- Hex grid radius capped at what renders at 60 FPS on a mid-range device
- No particle systems — cel-shading aesthetic relies on flat materials
- No physics simulation — unit movement is navmesh-driven, not physics-driven
- No real-time ambient sounds during gameplay — music only (future feature)
