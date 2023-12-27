import { Vector3D } from './Vector3D'
import { Matrix } from './types'
import {
    // createRotationXMatrix,
    // createRotationZMatrix,
    createTranslationMatrix, getCrossProduct, getDotProduct3D,
    multiplyVectorByMatrix, normalizeVector3D
} from './scripts'
import { Camera } from '../components/camera/Camera'

export class Triangle3D {
    _vertexes: Vector3D[]
    normal?: Vector3D

    constructor({ vertexes, normal = undefined }) {
        this._vertexes = vertexes
        this.normal = normal
    }

    getScreenSpaceProjection(projectionMatrix: Matrix, sWidth: number, sHeight: number) {
        //FIXME: зарефачить
        const triangle = this.getWorldSpaceProjection(projectionMatrix)

        if (!triangle) return null

        triangle.vertexes[0].x = (triangle.vertexes[0].x + 1) * 0.5 * sWidth
        triangle.vertexes[0].y = (triangle.vertexes[0].y + 1) * 0.5 * sHeight
        triangle.vertexes[1].x = (triangle.vertexes[1].x + 1) * 0.5 * sWidth
        triangle.vertexes[1].y = (triangle.vertexes[1].y + 1) * 0.5 * sHeight
        triangle.vertexes[2].x = (triangle.vertexes[2].x + 1) * 0.5 * sWidth
        triangle.vertexes[2].y = (triangle.vertexes[2].y + 1) * 0.5 * sHeight

        return triangle
    }

    getWorldSpaceProjection(projectionMatrix: Matrix) {
        /**FILLER**/
        //FIXME: это должно быть не тут
        // const zRotationMatrix = createRotationZMatrix(time)
        // const xRotationMatrix = createRotationXMatrix(time * 0.5)
        // const translationMatrix = createTranslationMatrix(0, 0, 6)

        //FIXME: вернуть вращение потом, через GameObject
        const worldMatrix = createTranslationMatrix(0, 0, 6)
        //     multiplyMatrixByMatrix(
        //     multiplyMatrixByMatrix(zRotationMatrix, xRotationMatrix),
        //     translationMatrix
        // )

        //FIXME: плейсхолдер
        const camera: Camera = window.camera as Camera
        
        const viewMatrix = camera.viewMatrix

        const translatedTriangle = new Triangle3D({
            vertexes: this.getVertexCopies()
        })

        translatedTriangle.vertexes[0] = multiplyVectorByMatrix(translatedTriangle.vertexes[0], viewMatrix),
        translatedTriangle.vertexes[1] = multiplyVectorByMatrix(translatedTriangle.vertexes[1], viewMatrix),
        translatedTriangle.vertexes[2] = multiplyVectorByMatrix(translatedTriangle.vertexes[2], viewMatrix)

        translatedTriangle.vertexes[0] = multiplyVectorByMatrix(translatedTriangle.vertexes[0], worldMatrix),
        translatedTriangle.vertexes[1] = multiplyVectorByMatrix(translatedTriangle.vertexes[1], worldMatrix),
        translatedTriangle.vertexes[2] = multiplyVectorByMatrix(translatedTriangle.vertexes[2], worldMatrix)

        /**FILLER**/

        const line1 = translatedTriangle.vertexes[1].subtract(translatedTriangle.vertexes[0])
        const line2 = translatedTriangle.vertexes[2].subtract(translatedTriangle.vertexes[0])

        const normal = normalizeVector3D(getCrossProduct(line1, line2))

        const cameraDotProduct = getDotProduct3D(
            normal,
            translatedTriangle.vertexes[0].subtract(camera.position)
        )

        if (cameraDotProduct >= 0 || isNaN(cameraDotProduct)) {
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
