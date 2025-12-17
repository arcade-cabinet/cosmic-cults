#![allow(unused)]
use bevy::prelude::*;
use game_physics::{
    GamePhysicsPlugin, MovementCommandEvent, MovementCommand,
    Velocity, AABB, Mass, MovementController, SpatialData
};

// Module declarations
pub mod components;
pub mod selection;
pub mod leadership;
pub mod spawning;
pub mod formations;
pub mod visuals;
pub mod physics_integration;
pub mod pathfinding_integration;

// Re-exports for easy access
pub use components::*;
pub use selection::*;
pub use leadership::*;
pub use spawning::*;
pub use formations::*;
pub use visuals::*;
pub use physics_integration::*;
pub use pathfinding_integration::*;

// Export additional types that bevy-web might need
pub use spawning::{UnitTemplates, UnitTemplate, GameAssets, init_game_assets};
pub use leadership::LeadershipBuilding;

// Re-export physics types units need
pub use game_physics::{MovementTarget, MovementPath};

// Main plugin for the game-units crate
#[derive(Default)]
pub struct GameUnitsPlugin;

impl Plugin for GameUnitsPlugin {
    fn build(&self, app: &mut App) {
        // Physics plugin is added by app.rs, don't add it here
        
        // Add physics integration plugin
        app.add_plugins(UnitsPhysicsIntegrationPlugin);
        
        // Add pathfinding integration plugin
        app.add_plugins(PathfindingIntegrationPlugin);
        
        app
            // Register resources
            .init_resource::<SelectionState>()
            .init_resource::<InputState>()
            .init_resource::<CommandQueue>()
            .init_resource::<UnitTemplates>()
            
            // Add startup system for loading assets
            .add_systems(Startup, init_game_assets)
            
            // Register systems in groups to avoid tuple length limits
            .add_systems(Update, (
                // Selection systems
                selection_system,
                movement_command_system,
                enhanced_movement_system,
                group_selection_system,
            ))
            .add_systems(Update, (
                // Visual systems - PRODUCTION visual updates
                update_health_bars,
                update_selection_indicators,
                animate_aura_visuals,
                animate_leader_platforms,
                update_veteran_indicators,
                handle_death_visuals,
                update_team_colors,
                animate_idle_units,
            ))
            .add_systems(Update, (
                // Formation systems
                formation_system,
                leader_formation_system,
                formation_switching_system,
                formation_maintenance_system,
                formation_spacing_system,
            ))
            .add_systems(Update, (
                // Leadership systems
                defeat_condition_system,
                leader_abilities_system,
                buff_application_system,
                aura_cleanup_system,
                passive_aura_system,
                platform_building_system,
            ))
            .add_systems(Update, (
                // Spawning systems (optional debug systems)
                debug_spawn_system,
            ));
    }
}