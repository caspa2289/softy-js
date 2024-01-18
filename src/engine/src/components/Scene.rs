use wasm_bindgen::prelude::wasm_bindgen;
use serde::{Deserialize,Serialize};
use crate::{game_object::GameObject, perspective_camera::PerspectiveCamera, traits::WithId, mesh::Mesh};

#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Scene {
    _objects: Option<Vec<GameObject>>,
    _meshes: Option<Vec<Mesh>>,
    _camera: Option<PerspectiveCamera>,
}

#[wasm_bindgen]
impl Scene {
    pub fn new() -> Self {
        Scene { _objects: None, _meshes: None, _camera: None }
    }

    pub fn add_objects(&mut self, mut objects: Vec<GameObject>) {
        let default = vec![] as Vec<GameObject>;
        let mut current_objects = (self._objects.as_ref().unwrap_or_else(|| &default)).to_vec();
        current_objects.append(&mut objects);
        self._objects = Some(current_objects);
    }

    pub fn add_meshes(&mut self, mut meshes: Vec<Mesh>) {
        let default = vec![] as Vec<Mesh>;
        let mut current_meshes = (self._meshes.as_ref().unwrap_or_else(|| &default)).to_vec();
        current_meshes.append(&mut meshes);
        self._meshes = Some(current_meshes);
    }

    pub fn remove_objects(&mut self, object_ids: Vec<String>) {
        let default = vec![] as Vec<GameObject>;
        let current_objects = (self._objects.as_ref().unwrap_or_else(|| &default)).to_vec();
        self._objects = Some(
            current_objects
            .into_iter()
            .filter(|game_object| !object_ids.contains(&game_object.get_id()))
            .collect::<Vec<GameObject>>()
        )
    }

    pub fn set_camera(&mut self, camera: PerspectiveCamera) {
        self._camera = Some(camera);
    }
}

impl Scene {
    pub fn get_objects(&self) -> Vec<GameObject> {
        let default = vec![] as Vec<GameObject>;
        (self._objects.as_ref().unwrap_or_else(|| &default)).to_vec()
    }

    pub fn get_meshes(&self) -> Vec<Mesh> {
        let default = vec![] as Vec<Mesh>;
        (self._meshes.as_ref().unwrap_or_else(|| &default)).to_vec()
    }

    pub fn get_mesh_ids(&self) -> Vec<String> {
        let default = vec![] as Vec<Mesh>;
        let meshes = (self._meshes.as_ref().unwrap_or_else(|| &default)).to_vec();
        let mut ids: Vec<String> = vec![] as Vec<String>;

        for mesh in meshes {
            ids.push(mesh.get_id())
        }

        ids
    }

    pub fn get_mesh_by_id(&self, id: String) -> Option<Mesh> {
        let default = vec![] as Vec<Mesh>;
        let meshes = (self._meshes.as_ref().unwrap_or_else(|| &default)).to_vec();
        meshes.into_iter().find(|mesh| mesh.get_id() == id)
    }

    pub fn get_camera(&self) -> &Option<PerspectiveCamera> {
        &self._camera
    }
}
