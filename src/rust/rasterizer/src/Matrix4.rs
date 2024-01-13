use std::ops;
use serde::{Deserialize,Serialize};
//FIXME: разобраться как правильно импорты делать
use crate::Vector3;

#[derive(Copy, Clone)]
#[derive(Serialize, Deserialize)]
pub struct Matrix4 {
    pub value: [[f64; 4]; 4]
}

impl Matrix4 {
    pub fn new() -> Self {
        Matrix4 {
            value: [
                [0.0, 0.0, 0.0, 0.0],
                [0.0, 0.0, 0.0, 0.0],
                [0.0, 0.0, 0.0, 0.0],
                [0.0, 0.0, 0.0, 0.0]
            ] as [[f64; 4]; 4]
        }
    }

    pub fn new_rotation_x(angle_rad: f64) -> Self {
        Matrix4 {
            value: [
                [ 1.0, 0.0, 0.0, 0.0 ],
                [ 0.0, angle_rad.cos(), angle_rad.sin(), 0.0 ],
                [ 0.0, -angle_rad.sin(), angle_rad.cos(), 0.0 ],
                [ 0.0, 0.0, 0.0, 1.0 ],
            ] as [[f64; 4]; 4]
        }
    }

    pub fn new_rotation_y(angle_rad: f64) -> Self {
        Matrix4 {
            value: [
                [ angle_rad.cos(), 0.0, angle_rad.sin(), 0.0 ],
                [ 0.0, 1.0, 0.0, 0.0 ],
                [ -angle_rad.sin(), 0.0, angle_rad.cos(), 0.0 ],
                [ 0.0, 0.0, 0.0, 1.0 ],
            ] as [[f64; 4]; 4]
        }
    }

    pub fn new_rotation_z(angle_rad: f64) -> Self {
        Matrix4 {
            value: [
                [ angle_rad.cos(), angle_rad.sin(), 0.0, 0.0 ],
                [ -angle_rad.sin(), angle_rad.cos(), 0.0, 0.0 ],
                [ 0.0, 0.0, 1.0, 0.0 ],
                [ 0.0, 0.0, 0.0, 1.0 ],
            ] as [[f64; 4]; 4]
        }
    }

    pub fn new_translation(vec: Vector3) -> Self {
        Matrix4 {
            value: [
                [ 1.0, 0.0, 0.0, 0.0 ],
                [ 0.0, 1.0, 0.0, 0.0 ],
                [ 0.0, 0.0, 1.0, 0.0 ],
                [ vec.x, vec.y, vec.z, 1.0 ],
            ] as [[f64; 4]; 4]
        }
    }

    pub fn new_projection(aspect_ratio: f64, fov_rad: f64, z_far: f64, z_near: f64) -> Self {
        Matrix4 {
            value: [
                [ aspect_ratio * fov_rad, 0.0, 0.0, 0.0 ],
                [ 0.0, fov_rad, 0.0, 0.0 ],
                [ 0.0, 0.0, z_far / (z_far - z_near), 1.0 ],
                [ 0.0, 0.0, (-z_far * z_near) / (z_far - z_near), 0.0 ],
            ] as [[f64; 4]; 4]
        }
    }

    pub fn new_world(rotation: Vector3, position: Vector3) -> Self {
        let rotation_x = Matrix4::new_rotation_x(rotation.x);
        let rotation_y = Matrix4::new_rotation_y(rotation.y);
        let rotation_z = Matrix4::new_rotation_z(rotation.z);
        let translation = Matrix4::new_translation(position);
        
        rotation_x * rotation_y * rotation_z * translation
    }

    pub fn new_point(position: Vector3, right: Vector3, up: Vector3, forward: Vector3) -> Self {
        Matrix4 {
            value: [
                [ right.x, right.y, right.z, 0.0 ],
                [ up.x, up.y, up.z, 0.0 ],
                [ forward.x,  forward.y, forward.z, 0.0 ],
                [ position.x, position.y, position.z, 1.0],
            ] as [[f64; 4]; 4]
        }
    }

    //FIXME: works only for rotation and translation matrices
    pub fn invert_hacky(m: Matrix4) -> Self {
        Matrix4 {
            value: [
                [ m.value[0][0], m.value[1][0], m.value[2][0], 0.0 ],
                [ m.value[0][1], m.value[1][1], m.value[2][1], 0.0 ],
                [ m.value[0][2], m.value[1][2], m.value[2][2], 0.0 ],
                [
                    -(m.value[3][0] * m.value[0][0] + m.value[3][1] * m.value[0][1] + m.value[3][2] * m.value[0][2]),
                    -(m.value[3][0] * m.value[1][0] + m.value[3][1] * m.value[1][1] + m.value[3][2] * m.value[1][2]),
                    -(m.value[3][0] * m.value[2][0] + m.value[3][1] * m.value[2][1] + m.value[3][2] * m.value[2][2]),
                    1.0
                ],
            ]
        }
    }

}

impl ops::Mul<Self> for Matrix4 {

    type Output = Self;

    fn mul(self, other: Self) -> Self {
        let mut result = Matrix4::new();
        for c in 1..=4 {
            for r in 1..=4 {
                result.value[r][c] = self.value[r][0] * other.value[0][c] 
                    + self.value[r][1] * other.value[1][c] 
                    + self.value[r][2] * other.value[2][c] 
                    + self.value[r][3] * other.value[3][c]
            }
        };

        result
    }
}
