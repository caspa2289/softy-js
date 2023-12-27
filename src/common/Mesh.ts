import { Triangle3D } from './Triangle3D'

export class Mesh {
    _triangles: Triangle3D[]

    constructor(triangles: Triangle3D[]) {
        this._triangles = triangles
    }

    get triangles() {
        return this._triangles
    }

    set triangles(value) {
        this._triangles = value
    }
}
