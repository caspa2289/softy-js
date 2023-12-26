import { Mesh } from '../common/Mesh'
import { Vector3D } from '../common/Vector3D'
import { Matrix } from '../common/types'
import { Triangle3D } from '../common/Triangle3D'
import { getDotProduct3D, normalizeVector3D } from '../common/scripts'

export class Rasterizer {
    static rasterize(
        data: Mesh[],
        projectionMatrix: Matrix,
        sWidth: number,
        sHeight: number,
        context: CanvasRenderingContext2D,
        time: number
    ) {
        context.fillStyle = 'black'
        context.fillRect(0, 0, sWidth, sHeight)
        data.forEach((mesh) => {
            //FIXME: нужно все треугольники в сцене сортировать, а не в меше
            mesh.getVisibleTrisSortedByZ(projectionMatrix, sWidth, sHeight, time)
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
        const maxX = Math.max(triangle.vertexes[0].x, Math.max(triangle.vertexes[1].x, triangle.vertexes[2].x))
        const minX = Math.min(triangle.vertexes[0].x, Math.min(triangle.vertexes[1].x, triangle.vertexes[2].x))
        const maxY = Math.max(triangle.vertexes[0].y, Math.max(triangle.vertexes[1].y, triangle.vertexes[2].y))
        const minY = Math.min(triangle.vertexes[0].y, Math.min(triangle.vertexes[1].y, triangle.vertexes[2].y))

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

        for (let x = minX; x <= maxX; x++)
        {
            for (let y = minY; y <= maxY; y++)
            {
                const q = { x: x - triangle.vertexes[0].x, y: y - triangle.vertexes[0].y }

                const s = numCrossProduct2D(q, vs2) / numCrossProduct2D(vs1, vs2)
                const t = numCrossProduct2D(vs1, q) / numCrossProduct2D(vs1, vs2)

                if ((s >= 0) && (t >= 0) && (s + t <= 1))
                {
                    //FIXME: убрать этот хак, разобраться как нормально вкрасить треугольники
                    context.fillRect(Math.round(x), Math.round(y), 2, 2)
                }
            }
        }
    }
}
