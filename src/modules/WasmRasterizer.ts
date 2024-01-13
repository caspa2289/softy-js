import { PerspectiveCamera } from '../components/camera/PerspectiveCamera'
import { GameObject } from '../components/gameObject/GameObject'
import { Vector3D } from '../common/Vector3D'
import { ENTITY_TYPES, Matrix } from '../common/types'
import { Triangle3D } from '../common/Triangle3D'
import init, { rasterize_frame } from 'wasm-software-rasterizer'

export class WasmRasterizer {
    private _rasterize: any

    constructor() {
        this._rasterize = null;
    }

    public async init() {
        await init()
        this._rasterize = rasterize_frame
    }

    // data: [Triangle3D[], number[], Vector3D, Vector3D, number, number][]

    // data: Vec<(Vec<Triangle3>, Vec<i64>, Vector3, Vector3, i64, i64)>,
    // projection_matrix: Matrix4,
    // screen_width: i64,
    // screen_height: i64,
    // viewport_width: i64,
    // viewport_height: i64,
    // camera_view_matrix: Matrix4,
    // camera_position: Vector3,
    // camera_z_near: f64,

    public rasterize(
        data: GameObject[],
        projectionMatrix: Matrix,
        sWidth: number,
        sHeight: number,
        context: CanvasRenderingContext2D,
        camera: PerspectiveCamera,
    ) {
        console.log(this._rasterize(
            data,
            projectionMatrix,
            sWidth,
            sHeight,
            context.canvas.width,
            context.canvas.height,
            camera.viewMatrix,
            camera.position,
            camera.zNear
        ))
    }
}
