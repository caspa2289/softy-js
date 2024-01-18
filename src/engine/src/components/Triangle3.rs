use std::ops;
use serde::{Deserialize,Serialize};
use crate::{vec3::Vector3,vec2::Vector2,mat4::Matrix4};

#[derive(Copy, Clone)]
#[derive(Serialize, Deserialize)]
pub struct Triangle3 {
    pub vertexes: [Vector3; 3],
    pub uv_coords: [Vector2; 3],
    pub normal: Vector3
}

impl Triangle3 {
    pub fn new(vertexes: [Vector3; 3], uv_coords: [Vector2; 3], normal: Vector3) -> Self {
        Triangle3 {
            vertexes,
            uv_coords,
            normal
        }
    }

    pub fn to_screen_space_normalized(triangle: Triangle3, screen_width: i32, screen_height: i32) -> Triangle3 {
        let mut result = Triangle3 {
            vertexes: [
                (triangle.vertexes[0] / triangle.vertexes[0].w) * -1.0,
                (triangle.vertexes[1] / triangle.vertexes[1].w) * -1.0,
                (triangle.vertexes[2] / triangle.vertexes[2].w) * -1.0
            ],
            uv_coords: [
                Vector2 {
                    u: triangle.uv_coords[0].u / triangle.vertexes[0].w,
                    v: triangle.uv_coords[0].v / triangle.vertexes[0].w,
                    w: 1.0 / triangle.vertexes[0].w
                },
                Vector2 {
                    u: triangle.uv_coords[1].u / triangle.vertexes[1].w,
                    v: triangle.uv_coords[1].v / triangle.vertexes[1].w,
                    w: 1.0 / triangle.vertexes[1].w
                },
                Vector2 {
                    u: triangle.uv_coords[2].u / triangle.vertexes[2].w,
                    v: triangle.uv_coords[2].v / triangle.vertexes[2].w,
                    w: 1.0 / triangle.vertexes[2].w
                }
            ],
            normal: triangle.normal
        };

        result.vertexes[0].x = (result.vertexes[0].x + 1.0) * 0.5 * screen_width as f64;
        result.vertexes[0].y = (result.vertexes[0].y + 1.0) * 0.5 * screen_height as f64;
        result.vertexes[1].x = (result.vertexes[1].x + 1.0) * 0.5 * screen_width as f64;
        result.vertexes[1].y = (result.vertexes[1].y + 1.0) * 0.5 * screen_height as f64;
        result.vertexes[2].x = (result.vertexes[2].x + 1.0) * 0.5 * screen_width as f64;
        result.vertexes[2].y = (result.vertexes[2].y + 1.0) * 0.5 * screen_height as f64;

        result
    }

    pub fn to_clipped_against_plane(
        plane_point: &Vector3,
        plane_normal: &Vector3,
        triangle: &Triangle3
    ) -> Vec<Triangle3> {
        let normalized_plane_normal = plane_normal.to_normalized();
        let mut inside_points: Vec<&Vector3> = vec![];
        let mut outside_points: Vec<&Vector3> = vec![];
        let mut inside_uv_coords: Vec<&Vector2> = vec![];
        let mut outside_uv_coords: Vec<&Vector2> = vec![];

        for (index, vertex) in triangle.vertexes.iter().enumerate() {
            if Vector3::get_distance_to_plane(*vertex, normalized_plane_normal, *plane_point) >= 0.0 {
                inside_points.push(vertex);
                inside_uv_coords.push(&triangle.uv_coords[index]);
            } else {
                outside_points.push(vertex);
                outside_uv_coords.push(&triangle.uv_coords[index]);
            }
        }

        match inside_points.len() {
            //Two sides of a triangle are clipped, create new triangle
            1 => {
                let new_v1 = Vector3::intersect_plane(*plane_point, *plane_normal, *inside_points[0], *outside_points[0]);
                let new_v2 = Vector3::intersect_plane(*plane_point, *plane_normal, *inside_points[0], *outside_points[1]);

                vec![
                    Triangle3 {
                        vertexes: [ *inside_points[0], new_v1.0, new_v2.0 ],
                        uv_coords: [
                            *inside_uv_coords[0],
                            Vector2 {
                                u: new_v1.1 * (outside_uv_coords[0].u - inside_uv_coords[0].u) + inside_uv_coords[0].u,
                                v: new_v1.1 * (outside_uv_coords[0].v - inside_uv_coords[0].v) + inside_uv_coords[0].v,
                                w: new_v1.1 * (outside_uv_coords[0].w - inside_uv_coords[0].w) + inside_uv_coords[0].w,
                            },
                            Vector2 {
                                u: new_v2.1 * (outside_uv_coords[1].u - inside_uv_coords[0].u) + inside_uv_coords[0].u,
                                v: new_v2.1 * (outside_uv_coords[1].v - inside_uv_coords[0].v) + inside_uv_coords[0].v,
                                w: new_v2.1 * (outside_uv_coords[1].w - inside_uv_coords[0].w) + inside_uv_coords[0].w,
                            }
                        ],
                        normal: triangle.normal
                    }
                ]
            },
            //One side of a triangle is clipped, divide resulting quad into two triangles
            2 => {
                let new_v1 = Vector3::intersect_plane(*plane_point, *plane_normal, *inside_points[0], *outside_points[0]);
                let new_v2 = Vector3::intersect_plane(*plane_point, *plane_normal, *inside_points[1], *outside_points[0]);
                
                let new_triangle0 = Triangle3 {
                    vertexes: [ inside_points[0].clone(), inside_points[1].clone(), new_v1.0 ],
                    uv_coords: [
                        inside_uv_coords[0].clone(),
                        inside_uv_coords[1].clone(),
                        Vector2 {
                            u: new_v1.1 * (outside_uv_coords[0].u - inside_uv_coords[0].u) + inside_uv_coords[0].u,
                            v: new_v1.1 * (outside_uv_coords[0].v - inside_uv_coords[0].v) + inside_uv_coords[0].v,
                            w: new_v1.1 * (outside_uv_coords[0].w - inside_uv_coords[0].w) + inside_uv_coords[0].w
                        }
                    ],
                    normal: triangle.normal
                };

                let new_triangle1 = Triangle3 {
                    vertexes: [new_triangle0.vertexes[0].clone(), new_triangle0.vertexes[1].clone(), new_v2.0],
                    uv_coords: [
                        new_triangle0.uv_coords[1].clone(),
                        new_triangle0.uv_coords[2].clone(),
                        Vector2 {
                            u: new_v2.1 * (outside_uv_coords[0].u - inside_uv_coords[1].u) + inside_uv_coords[1].u,
                            v: new_v2.1 * (outside_uv_coords[0].v - inside_uv_coords[1].v) + inside_uv_coords[1].v,
                            w: new_v2.1 * (outside_uv_coords[0].w - inside_uv_coords[1].w) + inside_uv_coords[1].w,
                        }
                    ],
                    normal: triangle.normal
                };

                vec![new_triangle0, new_triangle1]
            },
            // Triangle doesn`t need clipping
            3 => {
                return vec![*triangle];
            },
            // Triangle is completely clipped
            _ => {
                return vec![];
            },
        }
    }
}


impl ops::Mul<Matrix4> for Triangle3 {

    type Output = Self;

    fn mul(self, matrix: Matrix4) -> Self {
        Triangle3 {
            vertexes: [
                self.vertexes[0] * matrix,
                self.vertexes[1] * matrix,
                self.vertexes[2] * matrix,
            ],
            uv_coords: self.uv_coords,
            normal: self.normal
        }
    }
}
