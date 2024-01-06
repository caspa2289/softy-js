import { Triangle3D } from './Triangle3D'
import { Entity } from '../components/entity/Entity'
import { ENTITY_TYPES } from './types'

export class Mesh extends Entity {
    private _triangles: Triangle3D[]
    private _texture?: ImageData

    constructor(triangles: Triangle3D[], texture?: ImageData) {
        super()

        this._triangles = triangles
        this._texture = texture
        this._type = ENTITY_TYPES.Mesh
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
