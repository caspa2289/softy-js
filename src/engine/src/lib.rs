mod utils;
mod scripts;
#[path = "./components/Vector3.rs"] mod vec3;
#[path = "./components/Triangle3.rs"] mod tri3;
#[path = "./components/Vector2.rs"] mod vec2;
#[path = "./components/Matrix4.rs"] mod mat4;
#[path = "./components/Rasterizer.rs"] mod rasterizer;
#[path = "./components/Mesh.rs"] mod mesh;
#[path = "./components/PerspectiveCamera.rs"] mod perspective_camera;
#[path = "./components/Transform.rs"] mod transform;
#[path = "./components/GameObject.rs"] mod game_object;
#[path = "./components/Scene.rs"] mod scene;
#[path = "./components/Engine.rs"] mod engine;

// #[wasm_bindgen]
// extern "C" {
//     fn alert(s: &str);
// }

// type RasterizerInputData = Vec<(Vec<Triangle3>, Vec<u8>, Vector3, Vector3, i32, i32)>;
// #[wasm_bindgen]
// pub fn rasterize_frame(
//     raw_data: JsValue, 
//     raw_projection_matrix: JsValue,
//     screen_width: i32,
//     screen_height: i32,
//     viewport_width: i32,
//     viewport_height: i32,
//     raw_camera_view_matrix: JsValue,
//     raw_camera_position: JsValue,
//     camera_z_near: f64
// ) -> Vec<u8> {
//     let data: RasterizerInputData = serde_wasm_bindgen::from_value(raw_data).unwrap();
//     let projection_matrix: Matrix4 = serde_wasm_bindgen::from_value(raw_projection_matrix).unwrap();
//     let camera_view_matrix: Matrix4 = serde_wasm_bindgen::from_value(raw_camera_view_matrix).unwrap();
//     let camera_position: Vector3 = serde_wasm_bindgen::from_value(raw_camera_position).unwrap();

//     utils::set_panic_hook();
//     rasterize(
//         data, projection_matrix,
//         screen_width, screen_height, 
//         viewport_width, viewport_height,
//         camera_view_matrix, camera_position,
//         camera_z_near
//     )
// }
