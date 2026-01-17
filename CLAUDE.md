# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **See also:** `AGENTS.md` for comprehensive agent instructions.

## Critical Context

**MIGRATION ACTIVE**: This project is migrating from Rust/Bevy to React Native + BabylonJS (Reactylon).

- **DO NOT** modify Rust code unless specifically preserving designs
- **DO** follow the `.kiro/specs/1.0-migration/` specifications
- **DO** reference `wheres-ball-though` and `neo-tokyo-rival-academies` for patterns

## Quick Start

```bash
# Check current migration status
cat .kiro/specs/1.0-migration/tasks.md

# Check active context
cat memory-bank/activeContext.md 2>/dev/null || echo "No active context"

# Install dependencies (when project structure is set up)
pnpm install
```

## Development Workflow

### Before Making Changes
1. Read the task from `.kiro/specs/1.0-migration/tasks/`
2. Check `memory-bank/activeContext.md` for recent progress
3. Ensure prerequisite tasks are complete
4. Run tests to ensure clean starting state

### Making Changes
1. Create feature branch: `feat/<task-name>`
2. Make focused changes following the task checklist
3. Write/update tests for new functionality
4. Ensure all tests pass: `pnpm test`
5. Update task checkboxes when subtasks complete

### Committing
```bash
# Use conventional commits
git commit -m "feat(babylon): add isometric camera component"
git commit -m "fix(ecs): resolve entity disposal order"
git commit -m "docs: update task progress"
git commit -m "test(hex-grid): add coordinate conversion tests"
```

## Code Quality Checklist

Before considering work complete:
- [ ] All task subtasks checked off
- [ ] All tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] TypeScript compiles (`pnpm check`)
- [ ] Works on mobile (test in Expo)
- [ ] 60 FPS maintained

## Project Structure (Target)

```
.
├── apps/
│   ├── mobile/          # React Native + Expo
│   │   ├── app/         # Expo Router screens
│   │   └── src/
│   │       ├── components/babylon/  # BabylonJS wrappers
│   │       ├── systems/             # ECS systems
│   │       └── state/               # Miniplex + Zustand
│   └── web/             # Vite web build
├── packages/
│   ├── game-core/       # Shared game logic
│   └── types/           # Shared types
├── .kiro/
│   ├── specs/1.0-migration/  # Migration spec
│   └── steering/             # Agent guidelines
├── memory-bank/         # AI context files
├── docs/                # Documentation
├── CLAUDE.md            # This file
└── AGENTS.md            # Agent instructions
```

## Getting Help

1. Check `.kiro/specs/1.0-migration/tasks.md` for task details
2. Check `.kiro/steering/tech.md` for commands
3. Check `docs/` for design decisions
4. Reference `wheres-ball-though` for Expo patterns
5. Reference `neo-tokyo-rival-academies` for BabylonJS patterns

## Key Technologies

| Purpose | Technology |
|---------|------------|
| Mobile Framework | React Native + Expo SDK 54 |
| 3D Engine | BabylonJS + Reactylon |
| State (Game) | Miniplex ECS |
| State (UI) | Zustand |
| Navigation/AI | Navigation Plugin V2 |
| Build | Vite + EAS Build |
| Testing | Vitest + Maestro |
| Linting | Biome |

## Repository-Specific Notes

### Migration from Rust
- Original Rust/Bevy code preserved for reference
- Port game logic concepts, not code directly
- ECS patterns translate well (Bevy ECS → Miniplex)

### BabylonJS Integration
- Use Reactylon for React component integration
- Navigation Plugin V2 for pathfinding (replaces YukaJS)
- Cel-shaded materials for Lovecraftian aesthetic

### Meshy AI Assets
- Use consistent prompts for style cohesion
- Export as GLB with embedded textures
- May need Blender cleanup for rigging
