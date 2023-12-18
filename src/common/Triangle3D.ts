import { Vector3D } from './Vector3D'
import { Matrix } from './types'
import { multiplyMatrixByVector } from './scripts'

export class Triangle3D {
    _vertexes: Vector3D[]
    normal?: Vector3D

    constructor({ vertexes, normal = undefined }) {
        this._vertexes = vertexes
        this.normal = normal
    }

    getScreenSpaceProjection(projectionMatrix: Matrix, sWidth: number, sHeight: number, time: number) {
        //FIXME: зарефачить
        const triangle = this.getWorldSpaceProjection(projectionMatrix, time)

        if (!triangle) return null

        triangle.vertexes[0].x = (triangle.vertexes[0].x + 1) * 0.5 * sWidth
        triangle.vertexes[0].y = (triangle.vertexes[0].y + 1) * 0.5 * sHeight
        triangle.vertexes[1].x = (triangle.vertexes[1].x + 1) * 0.5 * sWidth
        triangle.vertexes[1].y = (triangle.vertexes[1].y + 1) * 0.5 * sHeight
        triangle.vertexes[2].x = (triangle.vertexes[2].x + 1) * 0.5 * sWidth
        triangle.vertexes[2].y = (triangle.vertexes[2].y + 1) * 0.5 * sHeight

        return triangle
    }

    getWorldSpaceProjection(projectionMatrix: Matrix, time: number) {

        const translatedTriangle = new Triangle3D({
            vertexes: this.getVertexCopies()
        })

        /**FILLER**/
        const zRotationMatrix = [
            [ Math.cos(time), Math.sin(time), 0, 0 ],
            [ -Math.sin(time), Math.cos(time), 0, 0 ],
            [ 0, 0, 1, 0 ],
            [ 0, 0, 0, 1 ],
        ]

        const xRotationMatrix = [
            [ 1, 0, 0, 0 ],
            [ 0, Math.cos(time * 0.5), Math.sin(time * 0.5), 0 ],
            [ 0, -Math.sin(time * 0.5), Math.cos(time * 0.5), 0 ],
            [ 0, 0, 0, 1 ],
        ]

        translatedTriangle.vertexes[0] = multiplyMatrixByVector(translatedTriangle.vertexes[0], xRotationMatrix),
        translatedTriangle.vertexes[1] = multiplyMatrixByVector(translatedTriangle.vertexes[1], xRotationMatrix),
        translatedTriangle.vertexes[2] = multiplyMatrixByVector(translatedTriangle.vertexes[2], xRotationMatrix)

        translatedTriangle.vertexes[0] = multiplyMatrixByVector(translatedTriangle.vertexes[0], zRotationMatrix),
        translatedTriangle.vertexes[1] = multiplyMatrixByVector(translatedTriangle.vertexes[1], zRotationMatrix),
        translatedTriangle.vertexes[2] = multiplyMatrixByVector(translatedTriangle.vertexes[2], zRotationMatrix)

        /**FILLER**/

        //FIXME: убрать когда будет камера
        translatedTriangle.vertexes[0].z += 9
        translatedTriangle.vertexes[1].z += 9
        translatedTriangle.vertexes[2].z += 9

        const line1 = new Vector3D(
            translatedTriangle.vertexes[1].x - translatedTriangle.vertexes[0].x,
            translatedTriangle.vertexes[1].y - translatedTriangle.vertexes[0].y,
            translatedTriangle.vertexes[1].z - translatedTriangle.vertexes[0].z,
        )

        const line2 = new Vector3D(
            translatedTriangle.vertexes[2].x - translatedTriangle.vertexes[0].x,
            translatedTriangle.vertexes[2].y - translatedTriangle.vertexes[0].y,
            translatedTriangle.vertexes[2].z - translatedTriangle.vertexes[0].z,
        )

        const normalizedX = (line1.y * line2.z) - (line1.z * line2.y)
        const normalizedY = (line1.z * line2.x) - (line1.x * line2.z)
        const normalizedZ = (line1.x * line2.y) - (line1.y * line2.x)
        const normalLength = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY + normalizedZ * normalizedZ)

        const normal = new Vector3D(
            normalizedX / normalLength,
            normalizedY / normalLength,
            normalizedZ / normalLength
        )

        //FIXME: плейсхолдер
        const camera = new Vector3D(0, 0, 0)

        const cameraDotProduct =
            normal.x * (translatedTriangle.vertexes[0].x - camera.x) +
            normal.y * (translatedTriangle.vertexes[0].y - camera.y) +
            normal.z * (translatedTriangle.vertexes[0].z - camera.z)

        if (cameraDotProduct < 0) {
            return null
        }

        return new Triangle3D({
            //FIXME: refactor
            vertexes: [
                //FIXME: венруть this когда будет камера
                multiplyMatrixByVector(translatedTriangle.vertexes[0], projectionMatrix),
                multiplyMatrixByVector(translatedTriangle.vertexes[1], projectionMatrix),
                multiplyMatrixByVector(translatedTriangle.vertexes[2], projectionMatrix)
            ]
        })
    }

    getVertexCopies() {
        return this._vertexes.map((vertex) => {
            return new Vector3D(vertex.x, vertex.y, vertex.z)
        })
    }

    get vertexes() {
        return this._vertexes
    }

    set vertexes(value) {
        this._vertexes = value
    }
}
