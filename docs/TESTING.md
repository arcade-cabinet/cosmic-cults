---
title: Testing
updated: 2026-04-09
status: current
domain: quality
---

# Testing

## Strategy

Property-based tests for all pure logic. Unit tests for ECS factories and archetypes. Integration and E2E tests are the next priority (not yet implemented).

BabylonJS rendering is not unit-tested — integration tests will run against a headless browser when implemented.

## Running Tests

```bash
pnpm test              # run all tests across all packages
pnpm test:coverage     # run with coverage report
pnpm --filter @cosmic-cults/ecs test          # single package
pnpm --filter @cosmic-cults/core test         # single package
```

## Test Frameworks

| Framework | Purpose |
|-----------|---------|
| Vitest | Test runner (all TypeScript packages) |
| fast-check | Property-based testing for game logic |
| Jest (jest-expo) | Mobile package (passWithNoTests until mobile tests are added) |

## Property-Based Tests

Use `fast-check` for any function with a mathematical invariant. Current coverage:

### `@cosmic-cults/core` — hex grid math

Arbitraries defined for `HexCoord`, `CubeCoord`, `WorldPosition`. Properties include:
- `axialToCube` and `cubeToAxial` are inverses
- `hexDistance` is symmetric and satisfies triangle inequality
- `hexesInRange(center, r)` produces `3r² + 3r + 1` tiles
- `hexRing(center, r)` produces `6r` tiles (or 1 for r=0)
- `worldToHex(hexToWorld(h))` round-trips correctly

### `@cosmic-cults/ecs` — ECS factories

Properties include:
- `createUnit` with any valid faction and type always produces a unit with correct health and speed
- Unit IDs are unique across 100 creations
- `createTile` ID is deterministic: `tile-${q}-${r}`
- Archetypes query correctly after add/remove cycles

## Unit Tests

### `@cosmic-cults/ecs` — `packages/ecs/src/ecs.test.ts`

| Test | Description |
|------|-------------|
| World starts empty | World has 0 entities before any additions |
| Add/remove entities | Entity count tracks correctly |
| createUnit faction/type | Component values match arguments |
| Health by unit type | cultist=50, acolyte=75, priest=100, avatar=500 |
| Speed by unit type | cultist=4, acolyte=3, priest=2, avatar=1 |
| Unique IDs | 100 units produce 100 distinct IDs |
| Not selected on create | `selected` component is undefined |
| Visible on create | `visible === true` |
| Not AI on create | `aiControlled` is undefined |
| HexCoord stored | Coordinate stored exactly on entity |
| createTile properties | Coord, terrain, visibility stored correctly |
| Tile deterministic ID | `tile-5--3` for coord `{q:5, r:-3}` |
| Archetypes — units | Queries only entities with `unit` component |
| Archetypes — tiles | Queries only entities with `tile` component |
| Archetypes — selected | Queries only entities with `selected` component |
| Archetypes — aiControlled | Queries only AI entities |
| Archetypes — movingEntities | Queries entities with `transform` and `movement` |
| removeEntity | Removes from world and archetypes |

## Test Setup Patterns

### ECS world cleanup

Always clear the world in `beforeEach` to prevent test pollution:

```typescript
beforeEach(() => {
  for (const entity of [...world.entities]) {
    world.remove(entity);
  }
});
```

### fast-check arbitraries

Reusable arbitraries for game types:

```typescript
const factionArbitrary = fc.constantFrom<FactionId>(
  'void-seekers', 'flesh-weavers', 'star-children'
);
const unitTypeArbitrary = fc.constantFrom<UnitType>(
  'cultist', 'acolyte', 'priest', 'avatar'
);
const hexCoordArbitrary = fc.record({
  q: fc.integer({ min: -50, max: 50 }),
  r: fc.integer({ min: -50, max: 50 }),
});
```

## What Is Not Tested (Yet)

- BabylonJS rendering (requires browser environment)
- Navigation navmesh construction (requires RecastJS WASM)
- Procedural terrain generation (visual output)
- Zustand store (simple pass-through, low priority)
- Mobile-specific behavior (Expo/React Native)

## Coverage Goals

- All pure math functions in `@cosmic-cults/core`: 100% covered by property tests
- All ECS factories and archetypes: covered by unit + property tests
- BabylonJS integration: integration tests to be added in Task 03+
- Mobile: E2E with Maestro to be added after mobile app stabilizes
