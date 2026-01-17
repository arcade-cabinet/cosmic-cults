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

State machines allow you to define discrete states for your AI entities and transitions between them.

```rust
use bevy::prelude::*;
use bevy_ai_toolkit::prelude::*;

fn setup(mut commands: Commands) {
    let mut state_machine = AIStateMachine::default();
    
    // Add custom transition
    state_machine.add_transition(
        AIState::Idle,
        AITransition::EnemySpotted,
        AIState::Attacking
    );
    
    commands.spawn(state_machine);
}

// Trigger transitions in your systems
fn ai_system(mut query: Query<&mut AIStateMachine>) {
    for mut sm in query.iter_mut() {
        if enemy_detected() {
            sm.transition(AITransition::EnemySpotted);
        }
    }
}
```

### Behavior Tree

Behavior trees provide a hierarchical way to define AI behaviors with reusable nodes.

```rust
use bevy::prelude::*;
use bevy_ai_toolkit::prelude::*;

fn setup(mut commands: Commands) {
    // Build a behavior tree: If has target, then attack
    let tree = BehaviorTreeBuilder::new()
        .condition(ConditionType::HasTarget, "check_target")
        .action(ActionType::Attack, "attack_target")
        .sequence()
        .build();
    
    commands.spawn(tree);
}
```

### Utility AI

Utility AI scores different actions based on considerations and selects the highest-scoring option.

```rust
use bevy::prelude::*;
use bevy_ai_toolkit::prelude::*;

fn setup(mut commands: Commands) {
    let mut ai = UtilityAI::new();
    
    // Add a consideration for health
    let health_consideration = ai.add_consideration(Consideration {
        name: "Health".to_string(),
        input_type: InputType::Health,
        curve: ResponseCurve::Linear,
        weight: 1.0,
    });
    
    // Add an action that uses the consideration
    ai.add_action(UtilityAction {
        name: "Retreat".to_string(),
        action_type: UtilityActionType::Retreat,
        considerations: vec![health_consideration],
        base_score: 0.5,
    });
    
    commands.spawn(ai);
}
```

### Targeting

The targeting system helps AI entities select and track targets based on different priorities.

```rust
use bevy::prelude::*;
use bevy_ai_toolkit::prelude::*;

fn setup(mut commands: Commands) {
    // Create a target selector that prioritizes closest enemies
    let selector = TargetSelector::new(TargetPriority::Closest);
    
    commands.spawn(selector);
}
```

## Plugin

Add the plugin to your Bevy app to enable all AI systems:

```rust
use bevy::prelude::*;
use bevy_ai_toolkit::BevyAIToolkitPlugin;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugins(BevyAIToolkitPlugin)
        .run();
}
```

## Architecture

The toolkit is designed to be:

- **Generic**: Works with any game genre
- **Modular**: Use only the systems you need
- **Extensible**: Easy to add custom states, actions, and behaviors
- **Composable**: Combine different AI systems for complex behaviors

## Game-Specific Extensions

While this toolkit provides generic AI systems, you can extend them for your specific game:

1. Add custom states to `AIState` enum via the `Custom(String)` variant
2. Add custom actions to `ActionType` via the `Custom(String)` variant  
3. Add custom considerations to `InputType` via the `Custom(String)` variant
4. Implement your own execution systems that react to toolkit components

## Examples

See the `cosmic-cults` game for a complete example of using this toolkit in a real game.

## License

Licensed under either of

 * Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
 * MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
