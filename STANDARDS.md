---
title: Code Standards
updated: 2026-04-09
status: current
domain: technical
---

# Code Standards

Non-negotiable constraints for all code in this repository.

## File Size

**Max 300 lines per file.** This applies to every language and every file type. Split by responsibility when approaching the limit.

## TypeScript

- Strict mode is enforced (`tsconfig.json` has `"strict": true`). No exceptions.
- No `any` type. Use `unknown` with type narrowing or proper generics.
- No non-null assertions (`!`) without a comment explaining why it is safe.
- Prefer `interface` over `type` for object shapes; use `type` for unions and aliases.
- All exports must be explicitly typed — no relying on inference at module boundaries.

## Formatting and Linting

Biome 2.x is the single tool for both formatting and linting. Configuration is in `biome.json` at repo root.

```bash
pnpm lint       # check
pnpm format     # fix
```

No ESLint. No Prettier. Do not add them.

## ECS (Miniplex)

- Component presence is truthy; absence means the component is not set.
- Never set a boolean component to `false`. Delete the property instead.
- Archetypes are defined in `packages/ecs/src/archetypes.ts`. All queries go there.
- Entity IDs must be deterministic for tiles (`tile-${q}-${r}`) and random UUIDs for units.

## BabylonJS

- All BabylonJS resources (meshes, materials, textures, plugins) must be disposed.
- Use thin instances (`thinInstanceSetBuffer`) for any grid of repeated geometry.
- Cel-shaded materials use `CellMaterial` from `@babylonjs/materials` — do not use `StandardMaterial` for game tiles.
- Orthographic projection for the isometric camera — no perspective camera.
- Target 60 FPS on mobile. Profile before and after rendering changes.

## State Management

- ECS world owns entity-level state.
- Zustand store owns UI and turn/phase state.
- No duplication between the two. If data belongs in one, do not copy it to the other.

## Testing

- Property-based tests (fast-check) for all pure math and game logic.
- Unit tests must clear the ECS world in `beforeEach`.
- Tests that require BabylonJS must mock the engine — no DOM in unit tests.
- Coverage is not a target number; all paths that carry game logic must have a test.

## Commits

Conventional Commits format is required:

```
feat(scope): description
fix(scope): description
docs: description
refactor(scope): description
test(scope): description
chore: description
```

Valid scopes: `engine`, `ecs`, `core`, `game`, `navigation`, `procedural`, `store`, `ui`, `mobile`, `web`, `types`, `config`.

## Pull Requests

- CI must pass before merge. No force-merging.
- All review comments must be addressed.
- Squash-merge to keep main history clean.

## What Not to Do

- Do not modify `docs/legacy/` — it is read-only reference material from the Rust era.
- Do not add React Three Fiber or Three.js dependencies.
- Do not add ESLint or Prettier.
- Do not use `cargo` commands — Rust is not the active target.
- Do not commit secrets, API keys, or `.env` files.
