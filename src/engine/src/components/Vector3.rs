use std::ops;
use serde::{Deserialize,Serialize};
use crate::mat4::Matrix4;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Copy, Clone)]
#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Vector3 {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub w: f64
}

#[wasm_bindgen]
impl Vector3 {
    pub fn new(x: f64, y: f64, z: f64, w: Option<f64>) -> Self {
        Vector3 { x, y, z, w: w.unwrap_or(1.0) }
    }

    pub fn length(self) -> f64 {
        (self * self).sqrt()
    }

    pub fn to_normalized(self) -> Self {
        let length = self.length();

        Vector3 {
            x: self.x / length,
            y: self.y / length,
            z: self.z / length,
            w: self.w
        }
    }
}

impl Vector3 {
    pub fn intersect_plane(
        plane_point: Vector3,
        plane_normal: Vector3,
        line_start: Vector3,
        line_end: Vector3,
    ) -> (Vector3, f64) {
        let normalized_plane_normal = plane_normal.to_normalized();
        let d_plane = -(normalized_plane_normal * plane_point);
        let ad = line_start * normalized_plane_normal;
        let bd = line_end * normalized_plane_normal;
        let t = (-d_plane - ad) / (bd - ad);

        (line_start + ((line_end - line_start) * t), t)
    }

    pub fn get_distance_to_plane(vertex: Vector3, plane_normal: Vector3, plane_point: Vector3) -> f64 {
        plane_normal * vertex - plane_normal * plane_point
    }
}

impl ops::Add<Self> for Vector3 {

    type Output = Self;

    fn add(self, other: Self) -> Self {
        Self {
            x: self.x + other.x,
            y: self.y + other.y,
            z: self.z + other.z,
            w: self.w
        }
    }
}

impl ops::Sub<Self> for Vector3 {

    type Output = Self;

    fn sub(self, other: Self) -> Self {
        Self {
            x: self.x - other.x,
            y: self.y - other.y,
            z: self.z - other.z,
            w: self.w
        }
    }
}

impl ops::Mul<f64> for Vector3 {

    type Output = Self;

    fn mul(self, scalar: f64) -> Self {
        Self {
            x: self.x * scalar,
            y: self.y * scalar,
            z: self.z * scalar,
            w: self.w
        }
    }
}

impl ops::Mul<i64> for Vector3 {

    type Output = Self;

    fn mul(self, scalar: i64) -> Self {
        Self {
            x: self.x * scalar as f64,
            y: self.y * scalar as f64,
            z: self.z * scalar as f64,
            w: self.w
        }
    }
}

impl ops::Mul<Matrix4> for Vector3 {

    type Output = Self;

    fn mul(self, matrix: Matrix4) -> Self {
        Self {
            x: self.x * matrix.value[0][0] + self.y * matrix.value[1][0] + self.z * matrix.value[2][0] + self.w * matrix.value[3][0],
            y: self.x * matrix.value[0][1] + self.y * matrix.value[1][1] + self.z * matrix.value[2][1] + self.w * matrix.value[3][1],
            z: self.x * matrix.value[0][2] + self.y * matrix.value[1][2] + self.z * matrix.value[2][2] + self.w * matrix.value[3][2],
            w: self.x * matrix.value[0][3] + self.y * matrix.value[1][3] + self.z * matrix.value[2][3] + self.w * matrix.value[3][3]
        }
    }
}

impl ops::Div<f64> for Vector3 {

    type Output = Self;

    fn div(self, scalar: f64) -> Self {
        Self {
            x: self.x / scalar,
            y: self.y / scalar,
            z: self.z / scalar,
            w: self.w
        }
    }
}

impl ops::Div<i64> for Vector3 {

    type Output = Self;

    fn div(self, scalar: i64) -> Self {
        Self {
            x: self.x / scalar as f64,
            y: self.y / scalar as f64,
            z: self.z / scalar as f64,
            w: self.w
        }
    }
}

//Dot product
impl ops::Mul<Self> for Vector3 {

    type Output = f64;

    fn mul(self, other: Self) -> f64 {
        self.x * other.x + self.y * other.y + self.z * other.z
    }
}

//Cross product
impl ops::Div<Self> for Vector3 {

    type Output = Self;

    fn div(self, other: Self) -> Self {
        Vector3 {
            x: self.y * other.z - self.z * other.y,
            y: self.z * other.x - self.x * other.z,
            z: self.x * other.y - self.y * other.x,
            w: self.w
        }
    }
}
