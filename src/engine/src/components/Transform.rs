use crate::{vec3::Vector3, mat4::Matrix4};
use wasm_bindgen::prelude::wasm_bindgen;
use serde::{Deserialize,Serialize};

#[derive(Copy, Clone)]
#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Transform {
    rotation: Vector3,
    position: Vector3,
    _rotation_x_matrix: Matrix4,
    _rotation_y_matrix: Matrix4,
    _rotation_z_matrix: Matrix4,
    _rotation_matrix: Matrix4,
}

impl Transform {
    pub fn new(rotation: Vector3, position: Vector3) -> Self {

        let rotation_x_matrix = Matrix4::new_rotation_x(rotation.x);
        let rotation_y_matrix = Matrix4::new_rotation_y(rotation.y);
        let rotation_z_matrix = Matrix4::new_rotation_z(rotation.z);
        let rotation_matrix = rotation_x_matrix * rotation_y_matrix * rotation_z_matrix;

        Self {
            rotation,
            position,
            _rotation_x_matrix: rotation_x_matrix,
            _rotation_y_matrix: rotation_y_matrix,
            _rotation_z_matrix: rotation_z_matrix,
            _rotation_matrix: rotation_matrix
        }
    }

    pub fn get_rotation(&self) -> &Vector3 {
        &self.rotation
    }

    pub fn get_position(&self) -> &Vector3 {
        &self.position
    }

    pub fn get_rotation_matrix(&self) -> &Matrix4 {
        &self._rotation_matrix
    }

}

#[wasm_bindgen]
impl Transform {
    pub fn set_position(&mut self, new_position: Vector3) {
        self.position = new_position;
    }

    pub fn set_rotation(&mut self, new_rotation: Vector3) {
        let x_changed = self.rotation.x != new_rotation.x;
        let y_changed = self.rotation.y != new_rotation.y;
        let z_changed = self.rotation.z != new_rotation.z;

        if x_changed {
            self._rotation_x_matrix = Matrix4::new_rotation_x(new_rotation.x);
        }

        if y_changed {
            self._rotation_y_matrix = Matrix4::new_rotation_y(new_rotation.y);
        }

        if z_changed {
            self._rotation_z_matrix = Matrix4::new_rotation_z(new_rotation.z);
        }

        if x_changed | y_changed | z_changed {
            self._rotation_matrix = self._rotation_x_matrix * self._rotation_y_matrix * self._rotation_z_matrix;
        }
    }

    pub fn rotate(&mut self, rotation: Vector3) {
        self.rotation = self.rotation + rotation
    }
}
