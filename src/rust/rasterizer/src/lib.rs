mod utils;
#[path = "Vector3.rs"] mod vec3;

use vec3::Vector3;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(value: &str) {
    alert(&format!("Hello, {}!", value));
}

#[wasm_bindgen]
pub fn rasterize_frame() {

}
