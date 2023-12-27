import { Vector3D } from './Vector3D'

export class Triangle3D {
    _vertexes: Vector3D[]
    normal?: Vector3D

    constructor({ vertexes, normal = undefined }) {
        this._vertexes = vertexes
        this.normal = normal
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
