use bevy::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Component)]
pub enum Cult {
    Crimson,
    Deep,
    Void,
}

pub mod models {
    pub mod buildings {
        pub const TEMPLE: &str = "models/buildings/temple.glb#Scene0";
    }
    pub mod units {
        pub const ACOLYTE: &str = "models/units/acolyte.glb#Scene0";
        pub const BLOOD_WARRIOR: &str = "models/units/blood_warrior.glb#Scene0";
        pub const DEEP_ONE: &str = "models/units/deep_one.glb#Scene0";
        pub const VOID_WALKER: &str = "models/units/void_walker.glb#Scene0";
    }
    pub mod terrain {
        pub const LANDMARK_OBELISK: &str = "models/terrain/obelisk.glb#Scene0";
    }
}
