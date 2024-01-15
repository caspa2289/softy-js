use wasm_bindgen_test::console_log;

use crate::{tri3::Triangle3, mat4::Matrix4, vec3::Vector3, scripts::get_pixel_data};

pub fn rasterize(
    data: Vec<(Vec<Triangle3>, Vec<u8>, Vector3, Vector3, i32, i32)>,
    projection_matrix: Matrix4,
    screen_width: i32,
    screen_height: i32,
    viewport_width: i32,
    viewport_height: i32,
    camera_view_matrix: Matrix4,
    camera_position: Vector3,
    camera_z_near: f64,
) -> Vec<u8> {
    let mut depth_buffer:Vec<f64> = vec![0.0; (viewport_width * viewport_height) as usize];
    let mut image_data: Vec<u8> = vec![0; (viewport_width * viewport_height * 4) as usize];

    let clipping_planes = [
        (
            Vector3{ x: 0.0, y: 0.0, z: 0.0, w: 0.0 },
            Vector3{ x: 0.0, y: 1.0, z: 0.0, w: 0.0 }
        ),
        (
            Vector3{ x: 0.0, y: (viewport_height - 1) as f64, z: 0.0, w: 0.0 },
            Vector3{ x: 0.0, y: -1.0, z: 0.0, w: 0.0 }
        ),
        (
            Vector3{ x: 0.0, y: 0.0, z: 0.0, w: 0.0 },
            Vector3{ x: 1.0, y: 0.0, z: 0.0, w: 0.0 }
        ),
        (
            Vector3{ x: (viewport_width - 1) as f64, y: 0.0, z: 0.0, w: 0.0 },
            Vector3{ x: -1.0, y: 0.0, z: 0.0, w: 0.0 }
        ),
    ];

    for mesh in &data {
        let triangles = mesh.0.to_owned();
        let texture_data = mesh.1.to_owned();
        let position = mesh.2.to_owned();
        let rotation = mesh.3.to_owned();
        let texture_width = mesh.4.to_owned();
        let texture_height = mesh.5.to_owned();

        let world_matrix = Matrix4::new_world(rotation, position);

        for triangle in &triangles {
            let translated_triangle = *triangle * world_matrix;
            let line1 = translated_triangle.vertexes[1] - translated_triangle.vertexes[0];
            let line2 = translated_triangle.vertexes[2] - translated_triangle.vertexes[0];
            let normal = (line1 / line2).to_normalized();
            let camera_dot_product = normal * (translated_triangle.vertexes[0] - camera_position);

            if camera_dot_product >= 0.0 {
                continue;
            }

            let view_translated_triangle = translated_triangle * camera_view_matrix;

            let mut clipped_triangles = Triangle3::to_clipped_against_plane(
                &Vector3 { x: 0.0, y: 0.0, z: camera_z_near, w: 0.0 },
                &Vector3 { x: 0.0, y: 0.0, z: 1.0, w: 0.0 },
                &view_translated_triangle
            );
            
            for i in 0..clipped_triangles.len() {
                clipped_triangles[i] = Triangle3::to_screen_space_normalized(
                    clipped_triangles[i] * projection_matrix,
                    screen_width,
                    screen_height
                );
            }

            for i in 0..clipping_planes.len() {
                let plane_point = clipping_planes[i].0;
                let plane_normal = clipping_planes[i].1;

                clipped_triangles = clipped_triangles.iter().fold(vec![], |res, triangle| {
                    [
                        &res[..],
                        &Triangle3::to_clipped_against_plane(&plane_point, &plane_normal, triangle)[..]
                    ].concat()
                });
            }

            for clipped_triangle in clipped_triangles {
                generate_triangle_data(
                    clipped_triangle,
                    screen_width,
                    &texture_data,
                    texture_width,
                    texture_height,
                    &mut image_data,
                    &mut depth_buffer
                );
            }
        }
    }

    return image_data.to_vec();
}

pub struct VertData { x: f64, y: f64, u: f64, v: f64, w: f64 }

pub fn generate_triangle_data(
    triangle: Triangle3,
    screen_width: i32,
    texture_data: &Vec<u8>,
    texture_width: i32,
    texture_height: i32,
    image_data: &mut Vec<u8>,
    depth_buffer: &mut Vec<f64>
) {
    let mut vert_data = [
        VertData {
            x: triangle.vertexes[0].x,
            y: triangle.vertexes[0].y,
            u: triangle.uv_coords[0].u,
            v: triangle.uv_coords[0].v,
            w: triangle.uv_coords[0].w
        },
        VertData {
            x: triangle.vertexes[1].x,
            y: triangle.vertexes[1].y,
            u: triangle.uv_coords[1].u,
            v: triangle.uv_coords[1].v,
            w: triangle.uv_coords[1].w
        },
        VertData {
            x: triangle.vertexes[2].x,
            y: triangle.vertexes[2].y,
            u: triangle.uv_coords[2].u,
            v: triangle.uv_coords[2].v,
            w: triangle.uv_coords[2].w
        }
        //FIXME: проверить порядок сортировки
    ];
    
    vert_data.sort_by(|a, b| a.y.total_cmp(&b.y));

    let mut dy1 = (vert_data[1].y - vert_data[0].y) as i32;
    let mut dx1 = (vert_data[1].x - vert_data[0].x) as i32;
    let mut du1 = vert_data[1].u - vert_data[0].u;
    let mut dv1 = vert_data[1].v - vert_data[0].v;
    let mut dw1 = vert_data[1].w - vert_data[0].w;

    let dy2 = (vert_data[2].y - vert_data[0].y) as i32;
    let dx2 = (vert_data[2].x - vert_data[0].x) as i32;
    let du2 = vert_data[2].u - vert_data[0].u;
    let dv2 = vert_data[2].v - vert_data[0].v;
    let dw2 = vert_data[2].w - vert_data[0].w;

    let mut x_step1: f64 = 0.0;
    let mut x_step2: f64 = 0.0;
    let mut u1_step: f64 = 0.0;
    let mut u2_step: f64 = 0.0;
    let mut v1_step: f64 = 0.0;
    let mut v2_step: f64 = 0.0;
    let mut w1_step: f64 = 0.0;
    let mut w2_step: f64 = 0.0;

    //FIXME: проверить это условие
    if dy1 != 0 {
        x_step1 = (dx1 / dy1.abs()) as f64;
        u1_step = du1 / dy1.abs() as f64;
        v1_step = dv1 / dy1.abs() as f64;
        w1_step = dw1 / dy1.abs() as f64;
    }

    if dy2 != 0 {
        x_step2 = (dx2 / dy2.abs()) as f64;
        u2_step = du2 / dy2.abs() as f64;
        v2_step = dv2 / dy2.abs() as f64;
        w2_step = dw2 / dy2.abs() as f64;
    }

    if dy1 != 0 {
        for i in (vert_data[0].y as i32)..=(vert_data[1].y as i32) {
            let ax = (vert_data[0].x + (i as f64 - vert_data[0].y) * x_step1) as i32;
            let bx = (vert_data[0].x + (i as f64 - vert_data[0].y) * x_step2) as i32;

            let su = vert_data[0].u + (i as f64 - vert_data[0].y) * u1_step;
            let sv = vert_data[0].v + (i as f64 - vert_data[0].y) * v1_step;
            let sw = vert_data[0].w + (i as f64 - vert_data[0].y) * w1_step;

            fill_pixels(
                i, ax, bx,
                su, sv, sw,
                u2_step, v2_step, w2_step,
                texture_data, texture_width, texture_height,
                image_data, screen_width, depth_buffer,
                &vert_data
            );
        }
    }

    dy1 = (vert_data[2].y - vert_data[1].y) as i32;
    dx1 = (vert_data[2].x - vert_data[1].x) as i32;
    du1 = vert_data[2].u - vert_data[1].u;
    dv1 = vert_data[2].v - vert_data[1].v;
    dw1 = vert_data[2].w - vert_data[1].w;

    if dy1 != 0 {
        x_step1 = (dx1 / dy1.abs()) as f64;
    }

    u1_step = 0.0;
    v1_step = 0.0;

    if dy1 != 0 {
        u1_step = du1 / dy1.abs() as f64;
        v1_step = dv1 / dy1.abs() as f64;
        w1_step = dw1 / dy1.abs() as f64;
    }

    if dy2 != 0 {
        x_step2 = (dx2 / dy2.abs()) as f64;
    }

    if dy1 != 0 {
        for i in (vert_data[1].y as i32)..=(vert_data[2].y as i32) {
            let ax = (vert_data[1].x + (i as f64 - vert_data[1].y) * x_step1) as i32;
            let bx = (vert_data[0].x + (i as f64 - vert_data[0].y) * x_step2) as i32;

            let su = vert_data[1].u + (i as f64 - vert_data[1].y) * u1_step;
            let sv = vert_data[1].v + (i as f64 - vert_data[1].y) * v1_step;
            let sw = vert_data[1].w + (i as f64 - vert_data[1].y) * w1_step;

            fill_pixels(
                i, ax, bx,
                su, sv, sw,
                u2_step, v2_step, w2_step,
                texture_data, texture_width, texture_height,
                image_data, screen_width, depth_buffer,
                &vert_data
            );
        }
    }
}

pub fn fill_pixels(
    i: i32, mut ax: i32, mut bx: i32,
    //starting uv values
    mut su: f64, mut sv: f64, mut sw: f64,
    u2_step: f64, v2_step: f64, w2_step: f64,
    texture_data: &Vec<u8>, texture_width: i32, texture_height: i32,
    image_data: &mut Vec<u8>,
    screen_width: i32, depth_buffer: &mut Vec<f64>, vert_data: &[VertData; 3]
) {
    //ending uv values
    let mut eu = vert_data[0].u + (i as f64 - vert_data[0].y) * u2_step;
    let mut ev = vert_data[0].v + (i as f64 - vert_data[0].y) * v2_step;
    let mut ew = vert_data[0].w + (i as f64 - vert_data[0].y) * w2_step;

    if ax > bx {
        (ax, bx) = (bx, ax);
        (su, eu) = (eu, su);
        (sv, ev) = (ev, sv);
        (sw, ew) = (ew, sw);
    }

    let mut t = 0.0;
    let t_step = 1.0 / (bx - ax) as f64;

    for j in (ax as i32)..(bx as i32) {
        let texture_u = (1.0 - t) * su + t * eu;
        let texture_v = (1.0 - t) * sv + t * ev;
        let texture_w = (1.0 - t) * sw + t * ew;

        let pixel_index = (i * screen_width + j) as usize;

        if texture_w > depth_buffer[pixel_index] {
            let texture_pixel_data = get_pixel_data(
                texture_width,
                texture_height,
                texture_data,
                texture_u / texture_w,
                texture_v / texture_w
            );

            image_data[(i * (screen_width * 4) + j * 4) as usize] = texture_pixel_data.0;
            image_data[(i * (screen_width * 4) + j * 4 + 1) as usize] = texture_pixel_data.1;
            image_data[(i * (screen_width * 4) + j * 4 + 2) as usize] = texture_pixel_data.2;
            image_data[(i * (screen_width * 4) + j * 4 + 3) as usize] = texture_pixel_data.3;

            depth_buffer[pixel_index] = texture_w;
        }

        t += t_step;
    }
}
