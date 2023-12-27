import { Vector3D } from '../../common/Vector3D'
import { TransformProps } from '../../common/types'

export class Transform {
    private _rotation: Vector3D
    private _position: Vector3D

    constructor({ rotation, position }: TransformProps) {
        this._rotation = rotation
        this._position = position
    }

    get rotation() {
        return this._rotation
    }

    get position() {
        return this._position
    }

    set rotation(value: Vector3D) {
        this._rotation = value
    }

    set position(value: Vector3D) {
        this._position = value
    }
}
