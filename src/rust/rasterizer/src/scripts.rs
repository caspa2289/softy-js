pub fn get_pixel_data(
    texture_width: i32,
    texture_height: i32,
    texture_data: &Vec<u8>,
    u: f64,
    v: f64
) -> (u8, u8, u8, u8) {
    let x: i32 = (v * texture_width as f64) as i32;
    let y: i32 = (u * texture_height as f64) as i32;

    let start_index: usize = (y * (texture_width * 4) + x * 4) as usize;

    (
        texture_data[start_index],
        texture_data[start_index + 1],
        texture_data[start_index + 2],
        texture_data[start_index + 3]
    )
} 
