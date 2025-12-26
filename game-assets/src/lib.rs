use bevy::prelude::*;
use serde::{Deserialize, Serialize};

pub mod models;
pub mod registry;

// Re-export commonly used types
pub use registry::{
    AssetRegistry, CommonMeshes, LeaderScenes, MaterialRegistry, UnitScenes, init_asset_registry,
};

#[derive(
    Clone, Copy, Debug, PartialEq, Eq, Hash, Serialize, Deserialize, Default, Component, Reflect,
)]
#[reflect(Component)]
pub enum Cult {
    #[default]
    Crimson,
    Deep,
    Void,
}
