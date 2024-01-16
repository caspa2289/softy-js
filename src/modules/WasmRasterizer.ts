// import { PerspectiveCamera } from '../components/camera/PerspectiveCamera'
import { GameObject } from '../components/gameObject/GameObject'
import { Vector3D } from '../common/Vector3D'
import { ENTITY_TYPES, Matrix } from '../common/types'
import init, { rasterize_frame, PerspectiveCamera, Vector3 } from 'softy-engine'
import { Mesh } from '../common/Mesh'

export class WasmRasterizer {
    private _rasterize: any

    constructor() {
        this._rasterize = null;
    }

    public async init() {
        await init()
        this._rasterize = rasterize_frame
    }

    public rasterize(
        data: GameObject[],
        projectionMatrix: Matrix,
        sWidth: number,
        sHeight: number,
        context: CanvasRenderingContext2D,
        // camera: PerspectiveCamera,
        camera: any
    ) {
        // const remappedData = [] as any[]

        // data.forEach((gameObject) => {
        //     gameObject.getChildrenByType<Mesh>(ENTITY_TYPES.Mesh).forEach((mesh) => {
        //         remappedData.push([
        //             mesh.triangles.map((triangle) => ({
        //                 uv_coords: triangle.UVCoordinates,
        //                 vertexes: triangle.vertexes,
        //                 normal: triangle.normal ?? new Vector3D(0, 0 ,0)
        //             })),
        //             mesh?.texture?.data ?? [],
        //             gameObject.position,
        //             gameObject.rotation,
        //             mesh?.texture?.width ?? 1,
        //             mesh?.texture?.height ?? 1
        //         ])
        //     })
        // })

        // const frameData = this._rasterize(
        //     remappedData,
        //     { value: projectionMatrix },
        //     sWidth,
        //     sHeight,
        //     context.canvas.width,
        //     context.canvas.height,
        //     { value: camera.viewMatrix },
        //     camera.position,
        //     camera.zNear
        // )

        // const imageData = context.createImageData(context.canvas.width, context.canvas.height)

        // imageData.data.set(frameData)

        // context.putImageData(imageData, 0 , 0)
    }
}
