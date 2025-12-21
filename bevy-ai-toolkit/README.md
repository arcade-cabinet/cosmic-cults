# Bevy AI Toolkit

Generic AI systems for the Bevy game engine, extracted from the Cosmic Cults game.

## Features

- **State Machines**: Flexible hierarchical state machine system with customizable transitions
- **Behavior Trees**: Composable behavior tree framework with sequence, selector, and decorator nodes
- **Utility AI**: Decision-making system based on utility scoring and response curves
- **Targeting System**: Advanced target selection with multiple priority strategies

## Installation

Add this to your `Cargo.toml`:

```toml
[dependencies]
bevy-ai-toolkit = "0.1"
```

## Quick Start

### State Machine

```rust
use bevy::prelude::*;
use bevy_ai_toolkit::state_machine::*;

fn setup(mut commands: Commands) {
    commands.spawn(AIStateMachine::default());
}
```

### Behavior Tree

```rust
use bevy::prelude::*;
use bevy_ai_toolkit::behavior_tree::*;

fn setup(mut commands: Commands) {
    let tree = BehaviorTreeBuilder::new()
        .condition(ConditionType::HasTarget, "check_target")
        .action(ActionType::Attack, "attack")
        .sequence()
        .build();
    
    commands.spawn(tree);
}
```

### Utility AI

```rust
use bevy::prelude::*;
use bevy_ai_toolkit::utility_ai::*;

fn setup(mut commands: Commands) {
    let ai = create_aggressive_ai();
    commands.spawn(ai);
}
```

## License

Licensed under either of

 * Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
 * MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.
