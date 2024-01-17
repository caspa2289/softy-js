use crate::transform::Transform;

pub trait WithId {
    fn get_id(&self) -> String;
}

pub trait WithTransform {
    fn get_transform(&self) -> Transform;
}