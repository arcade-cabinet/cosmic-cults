# Copilot Instructions

## Organization Context

This repository is part of the **jbcom** ecosystem:

- **Organization**: [jbcom](https://github.com/jbcom)
- **Control Center**: [jbcom/control-center](https://github.com/jbcom/control-center)
- **Portfolio**: [jbcom.github.io](https://jbcom.github.io)

## Project Management

Link issues and PRs to organization projects:

| Project | Purpose |
|---------|---------|
| **Roadmap** | Features and milestones |
| **Backlog** | Bug fixes, tech debt |
| **Sprint** | Active development |

## Repository Settings

This organization uses the [Settings GitHub App](https://github.com/apps/settings):

- **Org settings**: `jbcom/control-center/.github/settings.yml`
- **Repo settings**: `.github/settings.yml` (extends org settings)

## Code Standards

- Check existing patterns before creating new ones
- Run tests before AND after changes
- Follow established conventions

### Commit Format
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
```

---

## Repository-Specific Instructions

### Cosmic Cults - Lovecraftian 3D RTS

**Language**: Rust (Edition 2021, targeting 2024)
**Engine**: Bevy 0.16+ with Rapier3D physics
**Target**: WASM for web deployment

### Development Commands
```bash
# Development server with hot reload
trunk serve --address 0.0.0.0 --port 8080

# Check compilation
cargo check --all

# Run tests
cargo test --all

# Lint and format
cargo clippy -- -D warnings
cargo fmt

# Production WASM build
trunk build --release
```

### Crate Structure
| Crate | Purpose |
|-------|---------|
| `game-physics` | Rapier3D physics integration |
| `game-units` | Unit spawning, formations, selection |
| `game-ai` | State machines, behavior trees, utility AI |
| `game-combat` | Damage, effects, XP system |
| `game-world` | Terrain, fog of war, map management |

### Architecture Notes
- Uses vintage-game-generator output as foundation
- ECS-based architecture with Bevy systems
- WASM-first with browser compatibility focus
- Performance target: 60fps with 300+ entities

### Key Dependencies
- `bevy` - Game engine
- `bevy_rapier3d` - Physics
- `wasm-bindgen` - WASM interop
- `trunk` - WASM bundler
