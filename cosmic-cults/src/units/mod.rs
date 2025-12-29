use bevy::prelude::*;

// Module declarations
pub mod ai;
pub mod combat;
pub mod components;
pub mod formations;
pub mod hud;
pub mod leadership;
pub mod selection;
pub mod spawning;
pub mod visuals;

// Re-exports for easy access
pub use ai::*;
pub use combat::*;
pub use components::*;
pub use formations::*;
pub use hud::*;
pub use leadership::*;
pub use selection::*;
pub use spawning::*;
pub use visuals::*;

// Main plugin for the game-units crate
#[derive(Default)]
pub struct GameUnitsPlugin;

impl Plugin for GameUnitsPlugin {
    fn build(&self, app: &mut App) {
        app
            // Register resources
            .init_resource::<UnitTemplates>()
            // Add startup system for loading assets
            .add_systems(Startup, init_game_assets)
            // Register systems in groups
            .add_systems(
                Update,
                (
                    // Visual systems
                    update_health_bars,
                    animate_aura_visuals,
                    animate_leader_platforms,
                    update_veteran_indicators,
                    handle_death_visuals,
                    update_team_colors,
                    animate_idle_units,
                ),
            )
            .add_plugins(UnitAIPlugin)
            .add_plugins(selection_plugin)
            .add_plugins(combat_plugin)
            .add_plugins(hud_plugin);
    }
}
