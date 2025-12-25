pub mod ai;
pub mod ai_toolkit;
pub mod assets;
pub mod combat_system;
pub mod physics_engine;
pub mod units;
pub mod world;

// Re-export main plugins
pub use ai::GameAIPlugin;
pub use units::GameUnitsPlugin;
pub use world::GameWorldPlugin;
pub use combat_system::GameCombatPlugin;
pub use physics_engine::GamePhysicsPlugin;

// Re-export common types
pub use assets::Cult;
pub use units::{Unit, Team, Leader, Health};
