import { Vector3D } from '../common/Vector3D'
import { Matrix } from '../common/types'
import { Triangle3D } from '../common/Triangle3D'
import {
    clipTriangleAgainstPlane,
    createWorldMatrix,
    getCrossProduct,
    getDotProduct3D,
    normalizeVector3D
} from '../common/scripts'
import { Camera } from '../components/camera/Camera'
import { GameObject } from '../components/gameObject/GameObject'

export class Rasterizer {
    static rasterize(
        data: GameObject[],
        projectionMatrix: Matrix,
        sWidth: number,
        sHeight: number,
        context: CanvasRenderingContext2D,
    ) {
        //FIXME: плейсхолдер
        const camera: Camera = window.camera as Camera

        const clippingPlanes = [
            { point: new Vector3D(0, 0, 0), normal: new Vector3D(0, 1, 0) },
            { point: new Vector3D(0, camera.viewportHeight - 1, 0), normal: new Vector3D(0, -1, 0) },
            { point: new Vector3D(0, 0, 0), normal: new Vector3D(1, 0, 0) },
            { point: new Vector3D(camera.viewportWidth - 1, 0, 0), normal: new Vector3D(-1, 0, 0) }
        ]

        data.forEach((gameObject) => {
            const worldMatrix = createWorldMatrix(gameObject.rotation, gameObject.position)
            const imageData = context.createImageData(context.canvas.width, context.canvas.height)

            gameObject.meshes?.forEach((mesh) => {
                const viewMatrix = camera.viewMatrix

                const clippedTriangles = mesh.triangles.reduce((res, triangle) => {
                    const translatedTriangle = new Triangle3D({
                        vertexes: triangle.getVertexCopies()
                    })

                    translatedTriangle.applyMatrixMut(worldMatrix)

                    const line1 = translatedTriangle.vertexes[1].subtract(translatedTriangle.vertexes[0])
                    const line2 = translatedTriangle.vertexes[2].subtract(translatedTriangle.vertexes[0])

                    const normal = normalizeVector3D(getCrossProduct(line1, line2))

                    const cameraDotProduct = getDotProduct3D(
                        normal,
                        translatedTriangle.vertexes[0].subtract(camera.position)
                    )

                    if (cameraDotProduct >= 0 || isNaN(cameraDotProduct)) {
                        return res
                    }

                    translatedTriangle.applyMatrixMut(viewMatrix)

                    //Clip triangle against near plane
                    const clippedTriangles = clipTriangleAgainstPlane(
                        new Vector3D(0, 0, camera.zNear),
                        new Vector3D(0, 0, 1),
                        translatedTriangle
                    ).map((triangle) => {
                        triangle.normal = normal

                        return triangle
                            .applyMatrixMut(projectionMatrix)
                            .normalizeInScreenSpaceMut(sWidth, sHeight)
                    }, [] as Triangle3D[])

                    return [ ...res, ...clippedTriangles ]
                }, [] as Triangle3D[])
                    //FIXME: нужно все треугольники в сцене сортировать, а не в меше
                    .sort((t0, t1) => {
                        const averageZ0 = (t0.vertexes[0].z + t0.vertexes[1].z + t0.vertexes[2].z) / 3
                        const averageZ1 = (t1.vertexes[0].z + t1.vertexes[1].z + t1.vertexes[2].z) / 3

                        return averageZ1 - averageZ0
                    })

                let screenSpaceClippedTriangles: Triangle3D[] = clippedTriangles

                clippingPlanes.forEach(({ point, normal }) => {
                    screenSpaceClippedTriangles = screenSpaceClippedTriangles.reduce((res, triangle) => {
                        return [ ...res, ...clipTriangleAgainstPlane(
                            point,
                            normal,
                            triangle
                        ) ]
                    }, [] as Triangle3D[])
                })
                screenSpaceClippedTriangles.forEach((triangle) => {
                    this._generateTriangleData(triangle, imageData)
                    //FIXME: вернуть как wireframe мод для дебага
                    // context.fillStyle = 'green'
                    // for (let current = 0; current < triangle.vertexes.length; current++) {
                    //     const next = current === triangle.vertexes.length - 1 ? 0 : current + 1
                    //
                    //     this._drawLine(triangle.vertexes[current], triangle.vertexes[next], context)
                    // }
                })
            })

            context.putImageData(imageData, 0, 0)
        })
    }

    private static _setPixelData(value: [number, number, number, number], x: number, y: number, imageData: ImageData) {
        imageData.data[y * (imageData.width * 4) + x * 4] = value[0]
        imageData.data[y * (imageData.width * 4) + x * 4 + 1] = value[1]
        imageData.data[y * (imageData.width * 4) + x * 4 + 2] = value[2]
        imageData.data[y * (imageData.width * 4) + x * 4 + 3] = value[3]
    }

    //FIXME: зарефачить
    private static _drawLine(point0: Vector3D, point1: Vector3D, context: CanvasRenderingContext2D) {
        const { x: x0, y: y0 } = point0
        const { x: x1, y: y1 } = point1

        let dx = x1 - x0
        let dy = y1 - y0

        const step = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy)
        let [ stepX, stepY ] = [ x0, y0 ]

        dx /= step
        dy /= step

        for (let i = 0; i <= step; i++) {
            context.fillRect(Math.round(stepX), Math.round(stepY), 1, 1)
            stepX += dx
            stepY += dy
        }
    }

    private static _generateTriangleData(triangle: Triangle3D, imageData: ImageData) { //Barycentric Algorithm
        //FIXME: использовать более эффективный алгоритм
        //determine the triangle bounding box
        const maxX = Math.round(Math.max(triangle.vertexes[0].x, Math.max(triangle.vertexes[1].x, triangle.vertexes[2].x)))
        const minX = Math.round(Math.min(triangle.vertexes[0].x, Math.min(triangle.vertexes[1].x, triangle.vertexes[2].x)))
        const maxY = Math.round(Math.max(triangle.vertexes[0].y, Math.max(triangle.vertexes[1].y, triangle.vertexes[2].y)))
        const minY = Math.round(Math.min(triangle.vertexes[0].y, Math.min(triangle.vertexes[1].y, triangle.vertexes[2].y)))

        //FIXME: потереть когда будет освещение
        const lightPlaceholder = new Vector3D(0, 0, -1)
        const normalizedLightVector = normalizeVector3D(lightPlaceholder)

        const { normal } = triangle

        const rgbaValue = [ 0, 0, 0, 255 ]

        if (normal) {
            const dotProduct = getDotProduct3D(normalizedLightVector, normal)
            const rgbValue = Math.max(255 * dotProduct, 30)
            rgbaValue[0] = rgbValue
            rgbaValue[1] = rgbValue
            rgbaValue[2] = rgbValue
        }

        const vs1 = {
            x: triangle.vertexes[1].x - triangle.vertexes[0].x,
            y: triangle.vertexes[1].y - triangle.vertexes[0].y
        }
        const vs2 = {
            x: triangle.vertexes[2].x - triangle.vertexes[0].x,
            y: triangle.vertexes[2].y - triangle.vertexes[0].y
        }

        //FIXME: вынести куда-нибудь в утилиты и типизировать
        const numCrossProduct2D = (vector1: { x: number, y: number }, vector2: { x: number, y: number }): number => {
            return (vector1.x * vector2.y) - (vector1.y * vector2.x)
        }

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                const q = { x: x - triangle.vertexes[0].x, y: y - triangle.vertexes[0].y }

                const s = numCrossProduct2D(q, vs2) / numCrossProduct2D(vs1, vs2)
                const t = numCrossProduct2D(vs1, q) / numCrossProduct2D(vs1, vs2)

                if (s >= 0 && t >= 0 && s + t <= 1) {
                    this._setPixelData(rgbaValue, x, y, imageData)
                }
            }
        }
    }
}
