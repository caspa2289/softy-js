import { Vector3D } from './Vector3D'
import { Matrix } from './types'
import { multiplyVectorByMatrix, multiplyVectorByScalar } from './scripts'

export class Triangle3D {
    _vertexes: Vector3D[]
    normal?: Vector3D

    constructor({ vertexes, normal = undefined }) {
        this._vertexes = vertexes
        this.normal = normal
    }

    applyMatrixMut(matrix: Matrix): Triangle3D {
        this.vertexes[0] = multiplyVectorByMatrix(this.vertexes[0], matrix),
        this.vertexes[1] = multiplyVectorByMatrix(this.vertexes[1], matrix),
        this.vertexes[2] = multiplyVectorByMatrix(this.vertexes[2], matrix)

        return this
    }

    normalizeInScreenSpaceMut(screenWidth: number, screenHeight: number): Triangle3D {
        this.vertexes[0] = multiplyVectorByScalar(this.vertexes[0], 1 / this.vertexes[0].w)
        this.vertexes[1] = multiplyVectorByScalar(this.vertexes[1], 1 / this.vertexes[1].w)
        this.vertexes[2] = multiplyVectorByScalar(this.vertexes[2], 1 / this.vertexes[2].w)
        this.vertexes[0].x = (this.vertexes[0].x + 1) * 0.5 * screenWidth
        this.vertexes[0].y = (this.vertexes[0].y + 1) * 0.5 * screenHeight
        this.vertexes[1].x = (this.vertexes[1].x + 1) * 0.5 * screenWidth
        this.vertexes[1].y = (this.vertexes[1].y + 1) * 0.5 * screenHeight
        this.vertexes[2].x = (this.vertexes[2].x + 1) * 0.5 * screenWidth
        this.vertexes[2].y = (this.vertexes[2].y + 1) * 0.5 * screenHeight

        return this
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
