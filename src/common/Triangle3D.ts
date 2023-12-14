import { Vector3D } from './Vector3D'
import { Matrix } from './types'
import { multiplyMatrixByVector } from './scripts'

export class Triangle3D {
    _vertexes: Vector3D[]

    constructor({ vertexes }) {
        this._vertexes = vertexes
    }

    getScreenSpaceProjection(projectionMatrix: Matrix, sWidth: number, sHeight: number) {
        //FIXME: зарефачить
        const triangle = this.getWorldSpaceProjection(projectionMatrix)

        triangle.vertexes[0].x = (triangle.vertexes[0].x + 1) * 0.5 * sWidth
        triangle.vertexes[0].y = (triangle.vertexes[0].y + 1) * 0.5 * sHeight
        triangle.vertexes[1].x = (triangle.vertexes[1].x + 1) * 0.5 * sWidth
        triangle.vertexes[1].y = (triangle.vertexes[1].y + 1) * 0.5 * sHeight
        triangle.vertexes[2].x = (triangle.vertexes[2].x + 1) * 0.5 * sWidth
        triangle.vertexes[2].y = (triangle.vertexes[2].y + 1) * 0.5 * sHeight

        return triangle
    }

    getWorldSpaceProjection(projectionMatrix: Matrix) {

        const translatedTriangle = new Triangle3D({
            vertexes: [
                this.vertexes[0],
                this.vertexes[1],
                this.vertexes[2]
            ]
        })

        //FIXME: убрать когда будет камера
        translatedTriangle.vertexes[0].z += 3
        translatedTriangle.vertexes[1].z += 3
        translatedTriangle.vertexes[2].z += 3

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

    get vertexes() {
        return this._vertexes
    }

    set vertexes(value) {
        this._vertexes = value
    }
}
