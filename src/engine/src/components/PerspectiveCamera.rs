use core::f64::consts::PI;
use crate::{transform::Transform, vec3::Vector3, mat4::Matrix4};
use wasm_bindgen::prelude::wasm_bindgen;
use serde::{Deserialize,Serialize};

#[wasm_bindgen]
pub struct LocalAxis {
    forward: Vector3,
    up: Vector3,
    right: Vector3, 
    position: Vector3
}

const DEFAULT_OPTIONS: CameraOptions = CameraOptions {
    _viewport_width: 640,
    _viewport_height: 480,
    _z_far: 1000.0,
    _z_near: 0.1,
    _fov: 75.0
};

const UP_DIRECTION: Vector3 = Vector3 {
    x: 0.0,
    y: -1.0,
    z: 0.0,
    w: 1.0
};

#[wasm_bindgen]
pub struct CameraOptions {
    _viewport_width: i32,
    _viewport_height: i32,
    _z_far: f64,
    _z_near: f64,
    _fov: f64
}

#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct PerspectiveCamera {
    transform: Transform,
    _forward: Vector3,
    _viewport_width: i32,
    _viewport_height: i32,
    _z_far: f64,
    _z_near: f64,
    _fov: f64
}

#[wasm_bindgen]
impl PerspectiveCamera {
    pub fn new(rotation: Vector3, position: Vector3, options: Option<CameraOptions>) -> Self {
        let options_value = options.unwrap_or(DEFAULT_OPTIONS); 

        Self {
            transform: Transform::new(rotation, position),
            _forward: Vector3::new(0.0, 0.0, 1.0, None),
            _viewport_width: options_value._viewport_width,
            _viewport_height: options_value._viewport_height,
            _z_far: options_value._z_far,
            _z_near: options_value._z_near,
            _fov: options_value._fov
        }
    }

    pub fn get_viewport_width(&self) -> i32 {
        self._viewport_width.to_owned()
    }

    pub fn get_viewport_height(&self) -> i32 {
        self._viewport_height.to_owned()
    }

    pub fn get_z_far(&self) -> f64 {
        self._z_far.to_owned()
    }

    pub fn get_z_near(&self) -> f64 {
        self._z_near.to_owned()
    }

    pub fn get_fov(&self) -> f64 {
        self._fov.to_owned()
    }

    pub fn get_aspect_ratio(&self) -> f64 {
        self._viewport_height as f64 / self._viewport_width as f64
    }

    pub fn get_fov_radians(&self) -> f64 {
        1.0 / ((self._fov * 0.5 / 180.0 * PI).tan())
    }

    //FIXME: это тоже в transform надо перенести
    pub fn get_local_axis(&self) -> LocalAxis {
        let position = self.transform.get_position().to_owned();
        let rotation_matrix = self.transform.get_rotation_matrix().to_owned();
        let look_direction = self._forward * rotation_matrix;
        let look_target = position + look_direction;
        let forward = (look_target - position).to_normalized();
        let up = (UP_DIRECTION - (forward * (UP_DIRECTION * forward))).to_normalized();
        let right = up / forward;

        LocalAxis { forward, up, right, position }
    }

    pub fn get_transform(&self) -> Transform {
        self.transform
    }

    pub fn set_viewort_width(mut self, value: i32) {
        self._viewport_width = value;
    }

    pub fn set_viewort_height(mut self, value: i32) {
        self._viewport_height = value;
    }

    pub fn set_z_far(mut self, value: f64) {
        self._z_far = value;
    }

    pub fn set_z_near(mut self, value: f64) {
        self._z_near = value;
    }

    pub fn set_fov(mut self, value: f64) {
        self._fov = value;
    }
}

impl PerspectiveCamera {
    pub fn get_view_matrix(&self) -> Matrix4 {
        let local_axis = self.get_local_axis();
        let point_matrix = Matrix4::new_point(local_axis.position, local_axis.right, local_axis.up, local_axis.forward);

        Matrix4::invert_hacky(point_matrix)
    }
}
