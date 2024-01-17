use crate::{tri3::Triangle3, traits::WithId};
use serde::{Deserialize,Serialize};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

#[derive(Clone)]
#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Mesh {
    _triangles: Vec<Triangle3>,
    _texture_data: Option<Vec<u8>>,
    _texture_height: Option<i32>,
    _texture_width: Option<i32>,
    _id: String
}

type MeshTrianglesInputData = Vec<Triangle3>;

#[wasm_bindgen]
impl Mesh {
    pub fn new(
        _triangles: JsValue,
        _texture_data: Option<Vec<u8>>,
        _texture_height: Option<i32>,
        _texture_width: Option<i32>
    ) -> Self {

        let parsed_triangles: MeshTrianglesInputData = serde_wasm_bindgen::from_value(_triangles).unwrap_or(vec![]);

        Self { _triangles: parsed_triangles, _texture_data, _texture_height, _texture_width, _id: rand::random::<f64>().to_string() }
    }
}

impl Mesh {
    pub fn get_triangles(&self) -> Vec<Triangle3> {
        self._triangles.to_owned()
    }

    pub fn get_texture_data(&self) -> Option<Vec<u8>> {
        self._texture_data.to_owned()
    }

    pub fn get_texture_height(&self) -> Option<i32> {
        self._texture_height
    }

    pub fn get_texture_width(&self) -> Option<i32> {
        self._texture_width
    }
}

impl WithId for Mesh {
    fn get_id(&self) -> String {
        self._id.to_owned()
    }
}