# 1. BabylonJS Migration Foundation

**Parent:** [tasks.md](../tasks.md)
**Validates:** Requirements 1

## Overview

This task establishes the React Native + BabylonJS foundation, replacing the Rust/Bevy engine. This is the prerequisite for all subsequent work.

## Prerequisites

- Node.js 22+ installed
- PNPM 10+ installed
- Expo CLI installed (`pnpm add -g expo-cli`)
- Clean git working directory

## Tasks

### 1.1. Initialize Project Structure

**Validates:** Requirement 1.1

- [ ] 1.1.1. Create pnpm workspace
  - Create `pnpm-workspace.yaml` with apps/ and packages/
  - Set Node.js version in `.nvmrc` (22.22.0)
  - Configure pnpm in `package.json`

- [ ] 1.1.2. Initialize Expo mobile app
  - Run: `npx create-expo-app@latest apps/mobile --template blank-typescript`
  - Configure Expo Router for navigation
  - Verify app launches: `pnpm --filter @cosmic-cults/mobile dev`

- [ ] 1.1.3. Initialize web build
  - Create `apps/web/` with Vite + React + TypeScript
  - Configure shared code imports
  - Verify web build works

### 1.2. Install BabylonJS Dependencies

**Validates:** Requirement 1.1

- [ ] 1.2.1. Install core BabylonJS packages
  - Run: `pnpm add @babylonjs/core @babylonjs/loaders @babylonjs/gui @babylonjs/materials`
  - Run: `pnpm add @babylonjs/addons` (for Navigation Plugin V2)
  - Verify packages in package.json

- [ ] 1.2.2. Install Reactylon for React integration
  - Run: `pnpm add reactylon`
  - Verify compatibility with React 19

- [ ] 1.2.3. Install supporting packages
  - Run: `pnpm add miniplex zustand`
  - Run: `pnpm add recast-detour` (navigation WASM)
  - Verify all packages load without errors

### 1.3. Create BabylonJS Engine Wrapper

**Validates:** Requirement 1.1

- [ ] 1.3.1. Create BabylonCanvas component
  - File: `apps/mobile/src/components/babylon/BabylonCanvas.tsx`
  - Wrap Reactylon Engine and Scene components
  - Handle canvas ref for React Native
  - Implement error boundaries

- [ ] 1.3.2. Create scene context provider
  - File: `apps/mobile/src/components/babylon/SceneContext.tsx`
  - Provide scene access to child components
  - Handle scene disposal on unmount

- [ ] 1.3.3. Test basic scene rendering
  - Create simple ground plane
  - Add directional light
  - Verify renders in mobile and web

### 1.4. Setup Isometric Camera

**Validates:** Requirement 1.2

- [ ] 1.4.1. Create IsometricCamera component
  - File: `apps/mobile/src/components/babylon/IsometricCamera.tsx`
  - Implement ArcRotateCamera with orthographic mode
  - Set alpha = π/4 (45° rotation)
  - Set beta = π/3 (~60° elevation)
  - Configure ortho bounds for zoom

- [ ] 1.4.2. Add camera controls
  - Implement pan controls for mobile touch
  - Implement zoom controls (pinch gesture)
  - Lock rotation to isometric angles
  - Add smooth camera transitions

- [ ] 1.4.3. Test camera behavior
  - Verify isometric projection looks correct
  - Test pan bounds work properly
  - Test zoom range limits

### 1.5. Setup ECS with Miniplex

**Validates:** Requirement 1.5

- [ ] 1.5.1. Create Miniplex world
  - File: `apps/mobile/src/state/ecs.ts`
  - Define base entity components
  - Create world instance

- [ ] 1.5.2. Define core components
  ```typescript
  interface Position { q: number; r: number; y: number }
  interface Renderable { meshRef: string }
  interface Selectable { selected: boolean }
  interface CultMember { cult: CultType; health: number }
  ```

- [ ] 1.5.3. Create ECS system runner
  - File: `apps/mobile/src/systems/SystemRunner.tsx`
  - Run systems in requestAnimationFrame
  - Handle system ordering and dependencies

### 1.6. Setup Zustand for UI State

**Validates:** Requirement 1.5

- [ ] 1.6.1. Create game store
  - File: `apps/mobile/src/state/gameStore.ts`
  - Selection state
  - Camera position
  - UI mode (build, combat, etc.)

- [ ] 1.6.2. Create settings store
  - File: `apps/mobile/src/state/settingsStore.ts`
  - Graphics quality
  - Audio volumes
  - Control preferences

### 1.7. Setup Cel-Shaded Materials

**Validates:** Requirement 1.6

- [ ] 1.7.1. Create toon material factory
  - File: `apps/mobile/src/materials/ToonMaterial.ts`
  - Use BabylonJS CellMaterial or custom NodeMaterial
  - Configure stepped lighting for Lovecraftian aesthetic
  - Add rim lighting for eldritch glow

- [ ] 1.7.2. Create material presets
  - Void material (dark purple, cosmic particles)
  - Flesh material (organic, pulsing)
  - Sanctified material (golden, clean)
  - Corrupted material (green, sickly)

### 1.8. Performance Baseline

**Validates:** Requirement 1.3

- [ ] 1.8.1. Setup performance monitoring
  - File: `apps/mobile/src/utils/performance-monitor.ts`
  - Track FPS using engine.getFps()
  - Track frame time
  - Log performance warnings

- [ ] 1.8.2. Establish baseline metrics
  - Measure FPS with empty scene
  - Measure FPS with ground + camera
  - Document baseline numbers

- [ ] 1.8.3. Configure quality settings
  - File: `apps/mobile/src/config/quality-settings.ts`
  - Define low/medium/high presets
  - Implement quality switching

## Verification

After completing this section:
- [ ] BabylonJS scene renders in Expo mobile app
- [ ] Isometric camera with correct projection
- [ ] Miniplex ECS world created and accessible
- [ ] Zustand stores functional
- [ ] No TypeScript errors
- [ ] All tests pass
- [ ] Linting passes (`pnpm lint`)
- [ ] Performance baseline documented

## Common Commands

```bash
# Development
pnpm --filter @cosmic-cults/mobile dev

# Build
pnpm --filter @cosmic-cults/mobile build

# Test
pnpm --filter @cosmic-cults/mobile test

# Lint
pnpm lint
```

## Notes

- BabylonJS uses left-handed coordinate system
- Reactylon may need specific React Native canvas setup
- Test on physical device early for accurate performance baseline
- Keep Rust Bevy code as reference in `docs/legacy/`
