---
title: Agent Protocols
updated: 2026-04-09
status: current
domain: technical
---

# Agent Protocols

Extended operating instructions for all AI agents working on Cosmic Cults.

## Before Starting Any Task

1. Read `memory-bank/activeContext.md` for recent session state.
2. Run `git status` and `git log --oneline -5` to understand the current branch.
3. Check `gh pr list` for open PRs that need attention.
4. Verify the TypeScript workspace builds: `pnpm check`.

## Task Hierarchy

The active migration spec lives in `.kiro/specs/1.0-migration/`. Work through tasks in order — later tasks depend on earlier foundations.

```bash
cat .kiro/specs/1.0-migration/tasks.md        # current task list
cat .kiro/specs/1.0-migration/requirements.md # acceptance criteria
cat .kiro/specs/1.0-migration/design.md       # architecture decisions
cat .kiro/steering/tech.md                    # commands and patterns
```

## Agent Capabilities by Type

| Agent | Strengths | Primary Context |
|-------|-----------|-----------------|
| Claude | Architecture, cross-package work, complex reasoning | CLAUDE.md |
| Copilot | Targeted fixes, code generation in IDE | `.github/copilot-instructions.md` |
| Cursor | IDE-integrated development | `.cursor/rules/` |
| Kiro | Autonomous spec execution | `.kiro/` |

## Architecture Patterns

### ECS (Miniplex)

Components are properties on entities. Presence = truthy; absence = not set.

```typescript
// Correct: add by setting property
entity.selected = true;

// Correct: remove by deleting
delete entity.selected;

// Wrong: never set boolean components false
entity.selected = false; // do NOT do this
```

Archetypes are pre-defined queries. Add new archetypes in `packages/ecs/src/archetypes.ts`.

### BabylonJS Lifecycle

- Always initialize from `packages/engine/src/scene/` — never construct scenes inline.
- Dispose resources: meshes, materials, navigation plugins must call `.dispose()`.
- Use thin instances (`thinInstanceSetBuffer`) for tile grids, not individual meshes.
- Cel-shading uses `CellMaterial` from `@babylonjs/materials`.

### Hex Grid Coordinate Systems

- Axial coordinates (`HexCoord: { q, r }`) for storage and ECS.
- Cube coordinates (`CubeCoord: { x, y, z }`) for distance and rotation math.
- World coordinates (`WorldPosition: { x, y, z }`) for BabylonJS.
- Pointy-top hex orientation: `Math.PI / 6` rotation on cylinder meshes.
- Conversion utilities in `packages/core/src/hex/`.

### State Management Split

- ECS world (`packages/ecs/`) owns entity state (units, tiles, combat).
- Zustand store (`packages/store/`) owns UI state (camera target, selection, turn/phase).
- Never duplicate state between the two systems.

### Navigation

- RecastJS via `recast-navigation` — async `init()` before use.
- Call `initializeNavigation(scene)` once, then reuse the singleton.
- Build navmesh from terrain meshes after hex grid chunk creation.

## Error Recovery

### Build failures
1. `pnpm check` — find TypeScript errors first.
2. Check import paths use workspace aliases (`@cosmic-cults/...`), not relative paths.
3. Verify Reactylon component structure matches BabylonJS API version.

### Test failures
1. ECS world must be cleared in `beforeEach` — check test setup.
2. BabylonJS imports need mocking in unit tests (no DOM).
3. Use `fast-check` for property tests on game logic.

### Mobile issues
1. Clear Metro cache: `pnpm --filter @cosmic-cults/mobile clean`.
2. Rebuild native: `npx expo run:android` or `npx expo run:ios`.
3. Check `@babylonjs/react-native` version matches `@babylonjs/core`.

## Memory Bank Protocol

Read context at session start:

```bash
cat memory-bank/activeContext.md
```

Append at session end:

```bash
cat >> memory-bank/activeContext.md << 'EOF'

## Session: YYYY-MM-DD

### Completed
- [x] ...

### For Next Agent
- [ ] ...
EOF
```

## Commit Conventions

Conventional Commits with package scope:

```
feat(engine): add cel-shaded water material
fix(ecs): correct entity disposal order in removeEntity
test(core): add property tests for hexLine
docs: update STATE.md with Task 02 progress
```

## Critical Rules

- Do not touch Rust code in `docs/legacy/` — reference only.
- Follow the task dependency graph in `tasks.md` strictly.
- Verify 60 FPS on mobile after any rendering change.
- Update `memory-bank/activeContext.md` at the end of every session.
- Write property-based tests (fast-check) for all pure game logic functions.
