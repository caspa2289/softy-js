import { Mesh } from '../common/Mesh'
import { Vector3D } from '../common/Vector3D'
import { Matrix } from '../common/types'

export class Rasterizer {
    static rasterize(
        data: Mesh[],
        projectionMatrix: Matrix,
        sWidth: number,
        sHeight: number,
        context: CanvasRenderingContext2D
    ) {
        context.fillStyle = 'white'
        data.forEach((mesh) => {
            mesh.triangles.forEach((triangle) => {
                const projectedTriangle = triangle.getScreenSpaceProjection(projectionMatrix, sWidth, sHeight)

                for (let current = 0; current < projectedTriangle.vertexes.length; current++) {
                    const next = current === projectedTriangle.vertexes.length - 1 ? 0 : current + 1

                    this._drawLine(projectedTriangle.vertexes[current], projectedTriangle.vertexes[next], context)
                }
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
}
