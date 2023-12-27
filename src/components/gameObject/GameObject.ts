import { Transform } from '../transform/Transform'
import { GameObjectProps } from '../../common/types'

export class GameObject {
    private _transform: Transform

    constructor({ rotation, position }: GameObjectProps) {
        this._transform = new Transform({ rotation, position })
    }

    get position() {
        return this._transform.position
    }

    get rotation() {
        return this._transform.rotation
    }

    set position(value) {
        this._transform.position = value
    }

    set rotation(value) {
        this._transform.rotation = value
    }
}
