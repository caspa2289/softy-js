use std::ops;

#[derive(Copy, Clone)]
pub struct Vector3 {
    x: f32,
    y: f32,
    z: f32,
    w: f32
}

impl Vector3 {
    pub fn new(x: f32, y: f32, z: f32, w: Option<f32>) -> Self {
        Vector3 { x, y, z, w: w.unwrap_or(1.0) }
    }

    pub fn length(self) -> f32 {
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

impl ops::Mul<f32> for Vector3 {

    type Output = Self;

    fn mul(self, scalar: f32) -> Self {
        Self {
            x: self.x * scalar,
            y: self.y * scalar,
            z: self.z * scalar,
            w: self.w
        }
    }
}

impl ops::Mul<i32> for Vector3 {

    type Output = Self;

    fn mul(self, scalar: i32) -> Self {
        Self {
            x: self.x * scalar as f32,
            y: self.y * scalar as f32,
            z: self.z * scalar as f32,
            w: self.w
        }
    }
}

impl ops::Div<f32> for Vector3 {

    type Output = Self;

    fn div(self, scalar: f32) -> Self {
        Self {
            x: self.x / scalar,
            y: self.y / scalar,
            z: self.z / scalar,
            w: self.w
        }
    }
}

impl ops::Div<i32> for Vector3 {

    type Output = Self;

    fn div(self, scalar: i32) -> Self {
        Self {
            x: self.x / scalar as f32,
            y: self.y / scalar as f32,
            z: self.z / scalar as f32,
            w: self.w
        }
    }
}

//Dot product
impl ops::Mul<Self> for Vector3 {

    type Output = f32;

    fn mul(self, other: Self) -> f32 {
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

//FIXME: Add matrix multiplication