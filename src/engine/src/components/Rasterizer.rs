use wasm_bindgen::Clamped;
use web_sys::ImageData;
use crate::{
    tri3::Triangle3,
    mat4::Matrix4,
    vec3::Vector3,
    scripts::get_pixel_data,
    perspective_camera::PerspectiveCamera,
    scene::Scene
};
pub struct Rasterizer;

pub static mut DEPTH_BUFFER: Vec<f64> = vec![];
pub static mut FRAME_DATA: Vec<u8> = vec![];

pub struct VertData { x: f64, y: f64, u: f64, v: f64, w: f64 }

impl Rasterizer {
    pub fn rasterize(
        scene: &Scene,
        camera: &PerspectiveCamera,
        canvas: &web_sys::HtmlCanvasElement,
        context: &web_sys::CanvasRenderingContext2d,
    ) {

        let screen_width = canvas.client_width();
        let screen_height = canvas.client_height();
        let viewport_width = camera.get_viewport_width();
        let viewport_height = camera.get_viewport_height();

        unsafe {
            DEPTH_BUFFER = vec![0.0; (viewport_width * viewport_height) as usize];
            FRAME_DATA = vec![0; (viewport_width * viewport_height * 4) as usize];
        }

        let projection_matrix = Matrix4::new_projection(
            camera.get_aspect_ratio(),
            camera.get_fov_radians(),
            camera.get_z_far(),
            camera.get_z_near()
        );

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

        let mesh_ids = &scene.get_mesh_ids();

        for game_object in &scene.get_objects() {
            for child_id in &game_object.get_children() {
                if mesh_ids.contains(child_id) {
                    let mesh = scene.get_mesh_by_id(child_id.to_string());
                    let unwrapped_mesh = match mesh {
                        None => continue,
                        Some(x) => x
                    };
                    let game_object_transform = game_object.get_transform();
                    let triangles = unwrapped_mesh.get_triangles();
                    let texture_data = unwrapped_mesh.get_texture_data().unwrap_or(vec![255, 255, 255, 255]);
                    let position = game_object_transform.get_position().to_owned();
                    let rotation = game_object_transform.get_rotation().to_owned();
                    let texture_width = unwrapped_mesh.get_texture_width().unwrap_or(0);
                    let texture_height = unwrapped_mesh.get_texture_height().unwrap_or(0);
            
                    let world_matrix = Matrix4::new_world(rotation, position);
            
                    for triangle in &triangles {
                        let translated_triangle = *triangle * world_matrix;
                        let line1 = translated_triangle.vertexes[1] - translated_triangle.vertexes[0];
                        let line2 = translated_triangle.vertexes[2] - translated_triangle.vertexes[0];
                        let normal = (line1 / line2).to_normalized();
                        let camera_dot_product = normal * (
                            translated_triangle.vertexes[0] - camera.get_transform().get_position().to_owned()
                        );
            
                        if camera_dot_product >= 0.0 {
                            continue;
                        }
            
                        let view_translated_triangle = translated_triangle * camera.get_view_matrix();
            
                        let mut clipped_triangles = Triangle3::to_clipped_against_plane(
                            &Vector3 { x: 0.0, y: 0.0, z: camera.get_z_near(), w: 0.0 },
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
                            Rasterizer::generate_triangle_data(
                                clipped_triangle,
                                screen_width,
                                &texture_data,
                                texture_width,
                                texture_height,
                            );
                        }
                    }
                }
            }
        }

        unsafe {
            let result = ImageData::new_with_u8_clamped_array_and_sh(
                Clamped::<&[u8]>(&FRAME_DATA),
                screen_width as u32,
                screen_height as u32)
            .unwrap();
        
            context.put_image_data(&result, 0.0, 0.0).unwrap();
        }
    }

    pub fn generate_triangle_data(
        triangle: Triangle3,
        screen_width: i32,
        texture_data: &Vec<u8>,
        texture_width: i32,
        texture_height: i32,
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
    
                Rasterizer::fill_pixels(
                    i, ax, bx,
                    su, sv, sw,
                    u2_step, v2_step, w2_step,
                    texture_data, texture_width, texture_height,
                    screen_width,
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
    
                Rasterizer::fill_pixels(
                    i, ax, bx,
                    su, sv, sw,
                    u2_step, v2_step, w2_step,
                    texture_data, texture_width, texture_height,
                    screen_width,
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
        screen_width: i32, vert_data: &[VertData; 3]
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

            unsafe {
                if texture_w > DEPTH_BUFFER[pixel_index] {
                    let texture_pixel_data = get_pixel_data(
                        texture_width,
                        texture_height,
                        texture_data,
                        texture_u / texture_w,
                        texture_v / texture_w
                    );
        
                    FRAME_DATA[(i * (screen_width * 4) + j * 4) as usize] = texture_pixel_data.0;
                    FRAME_DATA[(i * (screen_width * 4) + j * 4 + 1) as usize] = texture_pixel_data.1;
                    FRAME_DATA[(i * (screen_width * 4) + j * 4 + 2) as usize] = texture_pixel_data.2;
                    FRAME_DATA[(i * (screen_width * 4) + j * 4 + 3) as usize] = texture_pixel_data.3;
        
                    DEPTH_BUFFER[pixel_index] = texture_w;
                }
            }
            
            t += t_step;
        }
    }
}
