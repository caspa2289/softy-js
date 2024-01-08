import { Vector3D } from './Vector3D'
import { Matrix } from './types'
import {divideVectorByScalar, multiplyVectorByMatrix, multiplyVectorByScalar} from './scripts'
import { Vector2D } from './Vector2D'

const placeholderUVCoords = [
    new Vector2D(0, 0),
    new Vector2D(0, 0),
    new Vector2D(0, 0)
]

export class Triangle3D {
    private _vertexes: Vector3D[]
    private _UVCoordinates: Vector2D[]
    normal?: Vector3D

    constructor({
        vertexes,
        UVCoordinates = placeholderUVCoords,
        normal = undefined
    } : { vertexes: Vector3D[], UVCoordinates: Vector2D[], normal?: Vector3D }) {
        this._vertexes = vertexes
        this._UVCoordinates = UVCoordinates
        this.normal = normal
    }

    applyMatrixMut(matrix: Matrix): Triangle3D {
        this.vertexes[0] = multiplyVectorByMatrix(this.vertexes[0], matrix),
        this.vertexes[1] = multiplyVectorByMatrix(this.vertexes[1], matrix),
        this.vertexes[2] = multiplyVectorByMatrix(this.vertexes[2], matrix)

        return this
    }

    normalizeInScreenSpaceMut(screenWidth: number, screenHeight: number): Triangle3D {
        //account for perspective
        this.UVCoordinates[0].u = this.UVCoordinates[0].u / this.vertexes[0].w
        this.UVCoordinates[0].v = this.UVCoordinates[0].v / this.vertexes[0].w
        this.UVCoordinates[0].w = 1 / this.vertexes[0].w

        this.UVCoordinates[1].u = this.UVCoordinates[1].u / this.vertexes[1].w
        this.UVCoordinates[1].v = this.UVCoordinates[1].v / this.vertexes[1].w
        this.UVCoordinates[1].w = 1 / this.vertexes[1].w

        this.UVCoordinates[2].u = this.UVCoordinates[2].u / this.vertexes[2].w
        this.UVCoordinates[2].v = this.UVCoordinates[2].v / this.vertexes[2].w
        this.UVCoordinates[2].w = 1 / this.vertexes[2].w

        this.vertexes[0] = divideVectorByScalar(this.vertexes[0], this.vertexes[0].w)
        this.vertexes[1] = divideVectorByScalar(this.vertexes[1], this.vertexes[1].w)
        this.vertexes[2] = divideVectorByScalar(this.vertexes[2], this.vertexes[2].w)

        this.vertexes[0] = multiplyVectorByScalar(this.vertexes[0], -1)
        this.vertexes[1] = multiplyVectorByScalar(this.vertexes[1], -1)
        this.vertexes[2] = multiplyVectorByScalar(this.vertexes[2], -1)

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
            return new Vector3D(vertex.x, vertex.y, vertex.z, vertex.w)
        })
    }

    getUVCoordinatesCopies() {
        return this._UVCoordinates.map((vec) => {
            return new Vector2D(vec.u, vec.v, vec.w)
        })
    }

    getNormalCopy() {
        if (this.normal) {
            return new Vector3D(this.normal.x, this.normal.y, this.normal.z, this.normal.w)
        } else {
            return undefined
        }

    }

    getCopy() {
        return new Triangle3D({
            vertexes: this.getVertexCopies(),
            UVCoordinates: this.getUVCoordinatesCopies(),
            normal: this.getNormalCopy()
        })
    }

    get vertexes() {
        return this._vertexes
    }

    get UVCoordinates() {
        return this._UVCoordinates
    }

    set vertexes(value) {
        this._vertexes = value
    }

    set UVCoordinates(value: Vector2D[]) {
        this._UVCoordinates = value
    }
}
