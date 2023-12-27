import { Mesh } from '../common/Mesh'
import { Vector3D } from '../common/Vector3D'
import { Matrix } from '../common/types'
import { Triangle3D } from '../common/Triangle3D'
import {
    createTranslationMatrix,
    getCrossProduct,
    getDotProduct3D,
    multiplyVectorByMatrix,
    normalizeVector3D
} from '../common/scripts'
import { Camera } from '../components/camera/Camera'

export class Rasterizer {
    static rasterize(
        data: Mesh[],
        projectionMatrix: Matrix,
        sWidth: number,
        sHeight: number,
        context: CanvasRenderingContext2D,
    ) {
        context.fillStyle = 'black'
        context.fillRect(0, 0, sWidth, sHeight)
        data.forEach((mesh) => {
            //FIXME: нужно все треугольники в сцене сортировать, а не в меше
            mesh.triangles.reduce((res, triangle) => {
                //FIXME: вернуть вращение потом, через GameObject
                // const zRotationMatrix = createRotationZMatrix(time)
                // const xRotationMatrix = createRotationXMatrix(time * 0.5)
                // const translationMatrix = createTranslationMatrix(0, 0, 6)
                const worldMatrix = createTranslationMatrix(0, 0, 6)
                //     multiplyMatrixByMatrix(
                //     multiplyMatrixByMatrix(zRotationMatrix, xRotationMatrix),
                //     translationMatrix
                // )

                //FIXME: плейсхолдер
                const camera: Camera = window.camera as Camera

                const viewMatrix = camera.viewMatrix

                const translatedTriangle = new Triangle3D({
                    vertexes: triangle.getVertexCopies()
                })

                translatedTriangle.vertexes[0] = multiplyVectorByMatrix(translatedTriangle.vertexes[0], worldMatrix),
                translatedTriangle.vertexes[1] = multiplyVectorByMatrix(translatedTriangle.vertexes[1], worldMatrix),
                translatedTriangle.vertexes[2] = multiplyVectorByMatrix(translatedTriangle.vertexes[2], worldMatrix)

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

                translatedTriangle.vertexes[0] = multiplyVectorByMatrix(translatedTriangle.vertexes[0], viewMatrix),
                translatedTriangle.vertexes[1] = multiplyVectorByMatrix(translatedTriangle.vertexes[1], viewMatrix),
                translatedTriangle.vertexes[2] = multiplyVectorByMatrix(translatedTriangle.vertexes[2], viewMatrix)

                const sTriangle = new Triangle3D({
                    //FIXME: refactor
                    vertexes: [
                        multiplyVectorByMatrix(translatedTriangle.vertexes[0], projectionMatrix),
                        multiplyVectorByMatrix(translatedTriangle.vertexes[1], projectionMatrix),
                        multiplyVectorByMatrix(translatedTriangle.vertexes[2], projectionMatrix)
                    ],
                    normal
                })

                if (!sTriangle) return res

                sTriangle.vertexes[0].x = (sTriangle.vertexes[0].x + 1) * 0.5 * sWidth
                sTriangle.vertexes[0].y = (sTriangle.vertexes[0].y + 1) * 0.5 * sHeight
                sTriangle.vertexes[1].x = (sTriangle.vertexes[1].x + 1) * 0.5 * sWidth
                sTriangle.vertexes[1].y = (sTriangle.vertexes[1].y + 1) * 0.5 * sHeight
                sTriangle.vertexes[2].x = (sTriangle.vertexes[2].x + 1) * 0.5 * sWidth
                sTriangle.vertexes[2].y = (sTriangle.vertexes[2].y + 1) * 0.5 * sHeight

                return [ ...res, sTriangle ]

            }, [] as Triangle3D[])
                .sort((t0, t1) => {
                    const averageZ0 = (t0.vertexes[0].z + t0.vertexes[1].z + t0.vertexes[2].z) / 3
                    const averageZ1 = (t1.vertexes[0].z + t1.vertexes[1].z + t1.vertexes[2].z) / 3

                    return averageZ1 - averageZ0
                })
                .forEach((triangle) => {
                    this._drawTriangle(triangle, context)

                    //FIXME: вернуть как wireframe мод для дебага
                    // context.fillStyle = 'green'
                    // for (let current = 0; current < triangle.vertexes.length; current++) {
                    //     const next = current === triangle.vertexes.length - 1 ? 0 : current + 1
                    //
                    //     this._drawLine(triangle.vertexes[current], triangle.vertexes[next], context)
                    // }
                })
        })
    }

    //FIXME: зарефачить
    static _drawLine(point0: Vector3D, point1: Vector3D, context: CanvasRenderingContext2D) {
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

    static _drawTriangle(triangle: Triangle3D, context: CanvasRenderingContext2D) { //Barycentric Algorithm
        //determine the triangle bounding box
        const maxX = Math.round(Math.max(triangle.vertexes[0].x, Math.max(triangle.vertexes[1].x, triangle.vertexes[2].x)))
        const minX = Math.round(Math.min(triangle.vertexes[0].x, Math.min(triangle.vertexes[1].x, triangle.vertexes[2].x)))
        const maxY = Math.round(Math.max(triangle.vertexes[0].y, Math.max(triangle.vertexes[1].y, triangle.vertexes[2].y)))
        const minY = Math.round(Math.min(triangle.vertexes[0].y, Math.min(triangle.vertexes[1].y, triangle.vertexes[2].y)))

        //FIXME: потереть когда будет освещение
        const lightPlaceholder = new Vector3D(0, 0, -1)
        const normalizedLightVector = normalizeVector3D(lightPlaceholder)

        const { normal } = triangle

        if (normal) {
            const dotProduct = getDotProduct3D(normalizedLightVector, normal)
            const rgbValue = 255 * dotProduct
            context.fillStyle = `rgb(${rgbValue},${rgbValue},${rgbValue})`
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
                    context.fillRect(Math.round(x), Math.round(y), 1, 1)
                }
            }
        }
    }
}
