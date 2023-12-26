import { Vector3D } from './Vector3D'
import { Matrix } from './types'
import {
    createRotationXMatrix,
    createRotationZMatrix,
    createTranslationMatrix, getDotProduct3D, multiplyMatrixByMatrix,
    multiplyVectorByMatrix, normalizeVector3D
} from './scripts'

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
        /**FILLER**/
        //FIXME: это должно быть не тут
        const zRotationMatrix = createRotationZMatrix(time)
        const xRotationMatrix = createRotationXMatrix(time * 0.5)
        const translationMatrix = createTranslationMatrix(0, 0, 16)

        const worldMatrix = multiplyMatrixByMatrix(
            multiplyMatrixByMatrix(zRotationMatrix, xRotationMatrix),
            translationMatrix
        )

        const translatedTriangle = new Triangle3D({
            vertexes: this.getVertexCopies()
        })

        translatedTriangle.vertexes[0] = multiplyVectorByMatrix(translatedTriangle.vertexes[0], worldMatrix),
        translatedTriangle.vertexes[1] = multiplyVectorByMatrix(translatedTriangle.vertexes[1], worldMatrix),
        translatedTriangle.vertexes[2] = multiplyVectorByMatrix(translatedTriangle.vertexes[2], worldMatrix)

        /**FILLER**/

        const line1 = translatedTriangle.vertexes[1].subtract(translatedTriangle.vertexes[0])
        const line2 = translatedTriangle.vertexes[2].subtract(translatedTriangle.vertexes[0])

        const normal = normalizeVector3D(
            new Vector3D(
                (line1.y * line2.z) - (line1.z * line2.y),
                (line1.z * line2.x) - (line1.x * line2.z),
                (line1.x * line2.y) - (line1.y * line2.x)
            )
        )

        //FIXME: плейсхолдер
        const camera = new Vector3D(0, 0, 0)

        const cameraDotProduct = getDotProduct3D(normal, translatedTriangle.vertexes[0].subtract(camera))

        if (cameraDotProduct > 0 || isNaN(cameraDotProduct)) {
            return null
        }

        return new Triangle3D({
            //FIXME: refactor
            vertexes: [
                multiplyVectorByMatrix(translatedTriangle.vertexes[0], projectionMatrix),
                multiplyVectorByMatrix(translatedTriangle.vertexes[1], projectionMatrix),
                multiplyVectorByMatrix(translatedTriangle.vertexes[2], projectionMatrix)
            ],
            normal
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
