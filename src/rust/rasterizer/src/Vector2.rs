use serde::{Deserialize,Serialize};

#[derive(Copy, Clone)]
#[derive(Serialize, Deserialize)]
pub struct Vector2 {
    pub u: f64,
    pub v: f64,
    pub w: f64
}
