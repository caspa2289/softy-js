use crate::tri3::Triangle3;
use serde::{Deserialize,Serialize};

#[derive(Serialize, Deserialize)]
pub struct Mesh {
    triangles: Vec<Triangle3>,
    texture_data: Option<Vec<u8>>,
    texture_height: Option<i32>,
    texture_width: Option<i32>
}

impl Mesh {
    pub fn new(
        triangles: Vec<Triangle3>,
        texture_data: Option<Vec<u8>>,
        texture_height: Option<i32>,
        texture_width: Option<i32>
    ) -> Self {
        Self { triangles, texture_data, texture_height, texture_width }
    }
}
