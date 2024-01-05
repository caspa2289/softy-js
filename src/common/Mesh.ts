import { Triangle3D } from './Triangle3D'

export class Mesh {
    private _triangles: Triangle3D[]
    private _texture?: ImageData

    constructor(triangles: Triangle3D[], texture?: ImageData) {
        this._triangles = triangles
        this._texture = texture
    }

    get triangles() {
        return this._triangles
    }

    set triangles(value) {
        this._triangles = value
    }

    get texture() {
        return this._texture
    }

    set texture(value) {
        this._texture = value
    }
}
