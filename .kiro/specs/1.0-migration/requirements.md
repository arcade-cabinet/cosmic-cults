# Requirements Document: Cosmic Cults 1.0 - React Native Migration

## Introduction

This specification defines the complete migration of Cosmic Cults from Rust/Bevy to React Native with BabylonJS (Reactylon) for mobile-first deployment. The game is a Lovecraftian 4X real-time strategy featuring cult management, tactical combat, and procedural generation.

## Glossary

- **System**: The complete Cosmic Cults game application
- **Player**: The end user playing the game
- **Cult**: A playable faction with unique abilities and aesthetics
- **Diorama**: The FF7-style isometric hex-grid playable area
- **Navigation_Mesh**: BabylonJS Navigation Plugin V2 pathfinding system
- **Crowd_Agent**: AI-controlled entity using navigation mesh
- **Hex_Grid**: Hexagonal tile-based terrain system
- **Combat_System**: Real-time tactical combat with cult-specific abilities
- **Fog_of_War**: Visibility system based on unit positions
- **Reactylon**: React integration library for BabylonJS
- **Meshy_AI**: GenAI pipeline for procedural 3D asset generation
- **ECS**: Entity Component System (Miniplex)

## Requirements

### Requirement 1: BabylonJS Migration Foundation

**User Story:** As a developer, I want to establish BabylonJS with Reactylon as the rendering engine, so that I can leverage RecastJS navigation and achieve mobile-first performance.

#### Acceptance Criteria

1. THE System SHALL render scenes using BabylonJS engine with Reactylon React integration
2. WHEN the application initializes, THE System SHALL create an orthographic isometric camera for diorama view
3. THE System SHALL maintain 60 FPS performance on mid-range mobile devices (Pixel 8a target)
4. THE System SHALL preserve game logic through Miniplex ECS architecture
5. THE System SHALL apply cel-shaded materials for Lovecraftian aesthetic
6. THE System SHALL support WASM builds for web browser deployment

### Requirement 2: Hex Grid Diorama System

**User Story:** As a player, I want to navigate a bounded isometric diorama with hex-tile terrain, so that I experience tactical positioning in the eldritch world.

#### Acceptance Criteria

1. THE System SHALL generate hexagonal tile grids using thin instances for performance
2. WHEN tiles are generated, THE System SHALL apply terrain types (void, corrupted, sanctified, water, eldritch) with seeded randomization
3. THE System SHALL implement clipping planes to bound the diorama at edges
4. THE System SHALL render parallax background panels at diorama boundaries
5. THE System SHALL snap unit positions to hex centers using axial coordinate conversion
6. THE System SHALL support dynamic terrain modification (corruption spread, sanctification)

### Requirement 3: Navigation and AI System

**User Story:** As a developer, I want RecastJS navigation mesh with crowd simulation, so that cult units can pathfind intelligently around obstacles and each other.

#### Acceptance Criteria

1. THE System SHALL bake navigation meshes from hex grid geometry using BabylonJS Navigation Plugin V2
2. WHEN a navigation mesh is baked, THE System SHALL support up to 32 simultaneous crowd agents
3. THE System SHALL provide agent steering with collision avoidance and separation
4. WHEN a unit is spawned, THE System SHALL add it to the crowd with configurable radius and speed
5. THE System SHALL update agent targets dynamically for pursuit, patrol, and formation behaviors
6. THE System SHALL provide debug visualization of navigation mesh for development

### Requirement 4: Cult Faction System

**User Story:** As a player, I want to choose and control one of three distinct cults, each with unique units, abilities, and visual aesthetics.

#### Acceptance Criteria

1. THE System SHALL implement three playable cults: Void Seekers, Flesh Weavers, Star Children
2. WHEN a cult is selected, THE System SHALL apply faction-specific color schemes and visual effects
3. THE System SHALL provide cult-specific unit types with unique abilities
4. THE System SHALL implement cult-specific building/structure types
5. THE System SHALL track cult progression (influence, corruption level, sanity)
6. THE System SHALL support asymmetric cult mechanics (different resource systems, win conditions)

### Requirement 5: Unit and Combat System

**User Story:** As a player, I want tactical real-time combat with meaningful unit variety and ability usage.

#### Acceptance Criteria

1. THE System SHALL implement unit stats: Health, Sanity, Attack, Defense, Speed, Range
2. WHEN combat occurs, THE System SHALL calculate damage using formula with cult-specific modifiers
3. THE System SHALL display combat effects using GPU particle systems
4. THE System SHALL implement special abilities with cooldowns and resource costs
5. THE System SHALL support unit formations and group commands
6. THE System SHALL track unit experience and provide upgrades

### Requirement 6: Fog of War and Visibility

**User Story:** As a player, I want fog of war that reveals the map as I explore, maintaining mystery and tactical depth.

#### Acceptance Criteria

1. THE System SHALL implement three visibility states: unexplored (black), explored (dim), visible (full)
2. WHEN units move, THE System SHALL update visibility based on unit sight range
3. THE System SHALL hide enemy units and buildings in non-visible areas
4. THE System SHALL remember previously explored terrain
5. THE System SHALL support special abilities that reveal hidden areas
6. THE System SHALL apply visual effects to fog boundaries (eldritch mist)

### Requirement 7: Procedural Asset Generation

**User Story:** As a developer, I want GenAI-generated 3D assets using Meshy AI, so that the game has rich visual variety without manual modeling.

#### Acceptance Criteria

1. THE System SHALL generate unit models using Meshy AI text-to-3D pipeline
2. WHEN generating assets, THE System SHALL apply consistent Lovecraftian style prompts
3. THE System SHALL auto-rig generated characters using Meshy presets
4. THE System SHALL generate minimum 5 animations per unit type (idle, walk, attack, ability, death)
5. THE System SHALL export all assets as GLB format with embedded textures
6. THE System SHALL validate assets against manifest schema

### Requirement 8: Mobile Deployment with Expo

**User Story:** As a player, I want to play on iOS and Android devices with native performance.

#### Acceptance Criteria

1. THE System SHALL build as Expo SDK 54 app with EAS Build for iOS and Android
2. WHEN the app launches on mobile, THE System SHALL detect device capabilities and adjust quality
3. THE System SHALL implement touch controls with virtual joystick and tap-to-select
4. THE System SHALL support device orientation and safe area insets
5. THE System SHALL maintain 60 FPS on Pixel 8a baseline
6. THE System SHALL handle app lifecycle events (pause, resume, background)

### Requirement 9: Save System and Persistence

**User Story:** As a player, I want to save my progress and resume later.

#### Acceptance Criteria

1. THE System SHALL save game state including map, units, buildings, resources, fog state
2. WHEN the player quits, THE System SHALL auto-save current state
3. THE System SHALL provide manual save points
4. THE System SHALL support multiple save slots (minimum 3)
5. THE System SHALL validate save data integrity
6. THE System SHALL support export/import for backup

### Requirement 10: Audio System

**User Story:** As a player, I want immersive audio with ambient soundscapes and combat effects.

#### Acceptance Criteria

1. THE System SHALL play ambient background audio appropriate to terrain and cult
2. WHEN combat starts, THE System SHALL transition to combat music
3. THE System SHALL play sound effects for unit actions and abilities
4. THE System SHALL implement spatial audio for 3D positioned sounds
5. THE System SHALL provide volume controls for music, SFX, and ambient separately

### Requirement 11: Performance and Optimization

**User Story:** As a player, I want smooth 60 FPS gameplay on mobile devices.

#### Acceptance Criteria

1. THE System SHALL maintain 60 FPS on Pixel 8a during normal gameplay
2. WHEN rendering hex grid, THE System SHALL use thin instances to minimize draw calls
3. THE System SHALL implement LOD for distant units and terrain
4. THE System SHALL lazy-load assets and unload unused resources
5. THE System SHALL limit active particle systems for performance
6. THE System SHALL provide quality settings (low/medium/high)

### Requirement 12: Testing and Quality Assurance

**User Story:** As a developer, I want comprehensive test coverage with property-based tests.

#### Acceptance Criteria

1. THE System SHALL implement property-based tests for game logic systems
2. WHEN running property tests, THE System SHALL execute minimum 100 iterations per property
3. THE System SHALL achieve >80% code coverage for game logic
4. THE System SHALL run E2E tests using Maestro for critical flows
5. THE System SHALL test on physical devices before release

### Requirement 13: Documentation

**User Story:** As a developer, I want comprehensive documentation for the codebase and APIs.

#### Acceptance Criteria

1. THE System SHALL provide README with setup instructions
2. THE System SHALL maintain up-to-date design documents
3. THE System SHALL provide code examples for common tasks
4. THE System SHALL document Meshy AI pipeline workflow
5. THE System SHALL include troubleshooting guide
