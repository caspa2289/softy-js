import { Transform } from '../transform/Transform'
import { GameObjectProps } from '../../common/types'
import { Mesh } from '../../common/Mesh'

export class GameObject {
    readonly _transform: Transform
    private _meshes?: Mesh[] | null

    constructor({ rotation, position, meshes }: GameObjectProps) {
        this._transform = new Transform({ rotation, position })
        this._meshes = meshes
    }

    get meshes() {
        return this._meshes
    }

    get transform() {
        return this._transform
    }

    get position() {
        return this._transform.position
    }

    get rotation() {
        return this._transform.rotation
    }

    set meshes(value) {
        this._meshes = value
    }

    set position(value) {
        this._transform.position = value
    }

    set rotation(value) {
        this._transform.rotation = value
    }
}
