use serde::{Deserialize,Serialize};
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Copy, Clone)]
#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Vector2 {
    pub u: f64,
    pub v: f64,
    pub w: f64
}
