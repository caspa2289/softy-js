mod utils;
mod scripts;
#[path = "Vector3.rs"] mod vec3;
#[path = "Triangle3.rs"] mod tri3;
#[path = "Vector2.rs"] mod vec2;
#[path = "Matrix4.rs"] mod mat4;
#[path = "Rasterizer.rs"] mod rasterizer;


use wasm_bindgen::prelude::*;
use vec3::Vector3;
use vec2::Vector2;
use mat4::Matrix4;
use tri3::Triangle3;
use rasterizer::rasterize;
use wasm_bindgen_test::console_log;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(value: &str) {
    alert(&format!("Hello, {}!", value));
}

type RasterizerInputData = Vec<(Vec<Triangle3>, Vec<u8>, Vector3, Vector3, i32, i32)>;

#[wasm_bindgen]
pub fn rasterize_frame(
    raw_data: JsValue, 
    raw_projection_matrix: JsValue,
    screen_width: i32,
    screen_height: i32,
    viewport_width: i32,
    viewport_height: i32,
    raw_camera_view_matrix: JsValue,
    raw_camera_position: JsValue,
    camera_z_near: f64
) -> Vec<u8> {
    let data: RasterizerInputData = serde_wasm_bindgen::from_value(raw_data).unwrap();
    let projection_matrix: Matrix4 = serde_wasm_bindgen::from_value(raw_projection_matrix).unwrap();
    let camera_view_matrix: Matrix4 = serde_wasm_bindgen::from_value(raw_camera_view_matrix).unwrap();
    let camera_position: Vector3 = serde_wasm_bindgen::from_value(raw_camera_position).unwrap();

    utils::set_panic_hook();
    rasterize(
        data, projection_matrix,
        screen_width, screen_height, 
        viewport_width, viewport_height,
        camera_view_matrix, camera_position,
        camera_z_near
    )
}
