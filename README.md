# Cosmic Cults (Rust)

[![CI](https://github.com/jbcom/rust-cosmic-cults/workflows/CI/badge.svg)](https://github.com/jbcom/rust-cosmic-cults/actions)
[![License](https://img.shields.io/badge/license-MIT%2FApache--2.0-blue.svg)](LICENSE)

A Lovecraftian 4X real-time strategy game built with the Bevy game engine, targeting WebGL/WASM for browser-based gameplay.

## Features

- 🎮 **3D RTS Mechanics**: Real-time strategy with proper 3D rendering
- 👁️ **Cult Management**: Control one of three distinct cults
- 🧠 **Advanced AI**: Behavior trees, utility AI, state machines
- ⚔️ **Combat Systems**: Damage, effects, XP progression
- 🌫️ **Fog of War**: Exploration and visibility mechanics
- 🌐 **Web-Native**: WASM compilation for browser play

## Crate Structure

| Crate | Description | Status |
|-------|-------------|--------|
| `game-ai` | AI systems, behavior trees, utility AI | 🚧 Migration |
| `game-combat` | Combat, damage, effects, XP | 🚧 Migration |
| `game-world` | World generation, terrain, fog of war | 🚧 Migration |
| `game-units` | Unit management, formations | 🚧 Migration |
| `game-physics` | Physics integration with Rapier3D | 🚧 Migration |
| `game-assets` | Asset loading and management | 🚧 Migration |
| `game-frontend` | Yew web frontend | 🚧 Migration |

## Development

```bash
# Check all crates
cargo check --all

# Run tests
cargo test --all

# Build for WASM
cargo build --target wasm32-unknown-unknown
```

## License

Licensed under either of:
- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE))
- MIT license ([LICENSE-MIT](LICENSE-MIT))

at your option.
