use bevy::prelude::*;
use bevy_egui::EguiPlugin;
use bevy_rts_camera::RtsCameraPlugin;
use cosmic_cults::{GameAIPlugin, GameUnitsPlugin, GameWorldPlugin};
use cosmic_cults::combat_system::GameCombatPlugin;
use cosmic_cults::physics_engine::GamePhysicsPlugin;
use leafwing_input_manager::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugins(EguiPlugin)
        .add_plugins(RtsCameraPlugin)
        .add_plugins(InputManagerPlugin::<PlayerAction>::default())
        .add_plugins(GamePhysicsPlugin::default())
        .add_plugins(GameWorldPlugin)
        .add_plugins(GameUnitsPlugin)
        .add_plugins(GameCombatPlugin)
        .add_plugins(GameAIPlugin)
        .run();
}

#[derive(Actionlike, PartialEq, Eq, Clone, Copy, Hash, Debug, Reflect)]
pub enum PlayerAction {
    Select,
    Order,
    PanCamera,
    ZoomCamera,
    RotateCamera,
}
