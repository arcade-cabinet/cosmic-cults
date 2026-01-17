# Design Document: Cosmic Cults 1.0 - Architecture Overview

## Executive Summary

Cosmic Cults 1.0 migrates from Rust/Bevy to React Native with BabylonJS (Reactylon) to achieve true mobile-first deployment while maintaining the Lovecraftian 4X RTS gameplay. The architecture leverages patterns proven in the arcade-cabinet ecosystem (wheres-ball-though, neo-tokyo-rival-academies).

## Technology Stack

### Core Technologies

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | React Native + Expo SDK 54 | Cross-platform mobile with native performance |
| **3D Engine** | BabylonJS + Reactylon | React integration, Navigation Plugin V2, mobile WebGL |
| **State Management** | Miniplex ECS + Zustand | Game entities via ECS, UI state via Zustand |
| **Navigation/AI** | Navigation Plugin V2 (RecastJS) | Crowd simulation, pathfinding |
| **Build** | Vite + EAS Build | Fast dev iteration, native mobile builds |
| **Testing** | Vitest + Maestro | Unit/integration + mobile E2E |
| **Linting** | Biome | Fast, unified linting/formatting |

### Package Structure

```
cosmic-cults/
├── apps/
│   ├── mobile/              # React Native + Expo
│   │   ├── app/            # Expo Router screens
│   │   ├── src/
│   │   │   ├── components/ # React + Reactylon components
│   │   │   │   ├── babylon/    # BabylonJS wrappers
│   │   │   │   ├── game/       # Game-specific 3D
│   │   │   │   └── ui/         # 2D UI components
│   │   │   ├── systems/    # ECS systems (game logic)
│   │   │   ├── state/      # Miniplex world + Zustand
│   │   │   ├── data/       # Static game data (JSON)
│   │   │   └── utils/      # Helpers
│   │   └── __tests__/
│   └── web/                 # Vite web build (shared code)
├── packages/
│   ├── game-core/          # Shared game logic (portable)
│   ├── assets/             # GLB models, textures, audio
│   └── types/              # Shared TypeScript types
├── .kiro/                   # Kiro specs and steering
├── docs/                    # Architecture documentation
└── memory-bank/            # AI context
```

## Architectural Decisions

### ADR-001: React Native over Capacitor

**Decision:** Use React Native with Expo instead of Capacitor (web wrapper).

**Context:** The original Rust/Bevy targeted WASM/WebGL which could be wrapped with Capacitor. However, Capacitor wraps web views which have performance limitations for real-time 3D.

**Consequences:**
- Native performance on iOS/Android
- Access to native APIs via Expo modules
- Requires separate web build (not shared WebView)
- Aligns with arcade-cabinet ecosystem (wheres-ball-though pattern)

### ADR-002: BabylonJS over Three.js

**Decision:** Use BabylonJS with Reactylon instead of Three.js with React Three Fiber.

**Context:** Both are capable 3D engines with React integrations, but BabylonJS offers:
- Navigation Plugin V2 with built-in RecastJS crowd simulation
- Better mobile WebGL optimization
- Integrated physics options (built-in or Havok)

**Consequences:**
- Learning curve for team familiar with Three.js
- Excellent documentation and playground tools
- Better fit for game-specific features (navigation, crowds)

### ADR-003: Miniplex ECS for Game State

**Decision:** Use Miniplex ECS for game entity management.

**Context:** The Rust/Bevy version used Bevy's built-in ECS. React applications typically use component state, but ECS provides better separation for game logic.

**Consequences:**
- Clean separation of game logic from rendering
- Portable game logic (can run headless for testing)
- Works well with Zustand for UI state

### ADR-004: Meshy AI for Asset Generation

**Decision:** Use Meshy AI text-to-3D pipeline for procedural asset generation.

**Context:** The Lovecraftian theme requires unique, unsettling creature designs. Manual 3D modeling is time-intensive.

**Consequences:**
- Rapid asset iteration with consistent style
- Requires prompt engineering for consistency
- GLB export format works well with BabylonJS
- May need manual cleanup in Blender for rigging

## System Architecture

### Component Hierarchy

```
<ExpoApp>
  <ZustandProvider>
    <MiniplexWorld>
      <BabylonCanvas>
        <IsometricCamera />
        <HemisphericLight />
        <HexGridDiorama>
          <TerrainTiles />
          <NavigationMesh />
          <FogOfWar />
        </HexGridDiorama>
        <UnitManager>
          <CultUnits />
          <EnemyUnits />
        </UnitManager>
        <EffectsManager>
          <ParticleSystems />
          <AbilityEffects />
        </EffectsManager>
      </BabylonCanvas>
      <GameUI>
        <ResourcePanel />
        <UnitSelection />
        <AbilityBar />
        <Minimap />
      </GameUI>
    </MiniplexWorld>
  </ZustandProvider>
</ExpoApp>
```

### Data Flow

```
User Input → Zustand Action → ECS System Update → Component Re-render
                                    ↓
                            BabylonJS Scene Update
                                    ↓
                            Navigation Mesh Query
                                    ↓
                            Crowd Agent Movement
```

### ECS Entities

```typescript
interface GameEntity {
  // Identity
  id: string;
  name?: string;

  // Transform (synced to BabylonJS)
  position: { q: number; r: number; y: number }; // Hex coords + height
  rotation: number;

  // Game state
  cult?: CultType;
  health?: number;
  sanity?: number;

  // Navigation
  crowdAgentId?: number;
  targetPosition?: { q: number; r: number };

  // Rendering (BabylonJS refs)
  mesh?: BABYLON.AbstractMesh;
  animations?: BABYLON.AnimationGroup[];
}
```

## Performance Budget

| Metric | Target | Measurement |
|--------|--------|-------------|
| FPS | 60 | BabylonJS engine.getFps() |
| Frame time | <16.67ms | Performance.now() delta |
| Memory | <512MB | React Native memory profiler |
| Startup | <3s | Cold start to gameplay |
| Bundle size | <50MB (split) | EAS build analysis |

## Security Considerations

1. **Save data**: Validate and sanitize save data on load
2. **Asset loading**: Verify GLB integrity, handle malformed files
3. **Network**: All API calls over HTTPS (if online features added)
4. **Secrets**: No hardcoded API keys in source

## Migration Strategy

### Phase 1: Foundation (Tasks 01-03)
- BabylonJS/Reactylon setup
- Isometric camera and basic scene
- Hex grid generation

### Phase 2: Core Systems (Tasks 04-06)
- Navigation mesh and AI
- Unit spawning and movement
- Combat system basics

### Phase 3: Game Features (Tasks 07-09)
- Cult factions and abilities
- Fog of war
- Save/load system

### Phase 4: Polish (Tasks 10-12)
- Audio system
- Mobile optimization
- Testing and QA

## References

- [BabylonJS Documentation](https://doc.babylonjs.com/)
- [Reactylon Guide](https://github.com/brianzinn/react-babylonjs)
- [Navigation Plugin V2](https://doc.babylonjs.com/features/featuresDeepDive/crowd/navigation)
- [Miniplex ECS](https://github.com/hmans/miniplex)
- [Expo SDK 54](https://docs.expo.dev/)
