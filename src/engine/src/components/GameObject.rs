use crate::{transform::Transform, vec3::Vector3, traits::WithTransform, traits::WithId};
use wasm_bindgen::prelude::wasm_bindgen;
use serde::{Deserialize,Serialize};

#[derive(Clone)]
#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct GameObject {
    transform: Transform,
    _parent: Option<String>,
    _children: Vec<String>,
    _id: String
}

#[wasm_bindgen]
impl GameObject {
    pub fn new(position: Vector3, rotation: Vector3) -> Self {
        Self {
            transform: Transform::new(rotation, position),
            _parent: None,
            _children: vec![],
            _id: rand::random::<f64>().to_string()
        }
    }

    pub fn set_parent(mut self, parent_id: String) {
        self._parent = Some(parent_id);
    }

    pub fn remove_parent(mut self) {
        self._parent = None;
    }

    pub fn add_child(mut self, child_id: String) {
        self._children.push(child_id)
    }

    pub fn remove_child(mut self, id: String){
        self._children = self._children.into_iter().filter(
            |game_object_id| *game_object_id != id
        ).collect();
    }
}

impl GameObject {
    pub fn get_children(&self) -> Vec<String> {
        self._children.to_owned()
    }
}

impl WithTransform for GameObject {
    fn get_transform(&self) -> Transform {
        self.transform
    }
}

impl WithId for GameObject {
    fn get_id(&self) -> String {
        self._id.to_owned()
    }
}