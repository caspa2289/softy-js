use crate::{transform::Transform, vec3::Vector3};
use wasm_bindgen::prelude::wasm_bindgen;
use serde::{Deserialize,Serialize};

#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct GameObject {
    transform: Transform,
    _parent: Box<Option<GameObject>>,
    _children: Box<Vec<GameObject>>,
    _id: String
}

#[wasm_bindgen]
impl GameObject {
    pub fn new(position: Vector3, rotation: Vector3) -> Self {
        GameObject {
            transform: Transform::new(rotation, position),
            _parent: Box::new(None),
            _children: Box::new(vec![] as Vec<GameObject>),
            _id: rand::random::<f64>().to_string()
        }
    }

    pub fn set_parent(mut self, parent: GameObject) {
        self._parent = Box::new(Some(parent));
    }

    pub fn remove_parent(mut self) {
        self._parent = Box::new(None);
    }

    pub fn add_child(mut self, child: GameObject) {
        self._children.push(child)
    }

    pub fn remove_child(mut self, id: String){
        self._children = Box::new(
            self._children.into_iter().filter(
                |game_object| game_object._id != id
            ).collect()
        );
    }

}