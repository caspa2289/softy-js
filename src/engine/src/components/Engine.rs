use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsCast;
use crate::rasterizer::Rasterizer;
use crate::scene::Scene;
use crate::utils;

#[wasm_bindgen]
pub struct Engine {
    _scene: Option<Scene>,
    _canvas: web_sys::HtmlCanvasElement,
    _context: web_sys::CanvasRenderingContext2d,
    _prev_frame_time: f64,
    _delta_time: f64,
}

#[wasm_bindgen]
impl Engine {
    pub fn new(canvas: web_sys::HtmlCanvasElement) -> Self {
        utils::set_panic_hook();
        let context = canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<web_sys::CanvasRenderingContext2d>()
            .unwrap();

        Engine {
            _scene: None,
            _canvas: canvas,
            _context: context,
            _prev_frame_time: 0.0,
            _delta_time: 0.0,
        }
    }

    pub fn set_scene(&mut self, scene: Option<Scene>) {
        self._scene = scene
    }

    pub fn update(&mut self, elapsed_time: f64) -> Vec<u8> {
        self._delta_time = elapsed_time - self._prev_frame_time;
        self._prev_frame_time = elapsed_time;

        let scene = match &self._scene {
            None => panic!("No scene selected"),
            Some(scene) => scene
        };

        let camera = match &scene.get_camera() {
            None => panic!("No camera attached to a scene"),
            Some(camera) => camera
        };

        Rasterizer::rasterize(&scene, camera, &self._canvas, &self._context)
    }
}
