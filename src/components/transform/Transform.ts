import { Vector3D } from '../../common/Vector3D'
import { TransformProps } from '../../common/types'

export class Transform {
    private _rotation: Vector3D
    private _position: Vector3D

    constructor({ rotation, position }: TransformProps) {
        this._rotation = new Proxy(rotation, {
            get(target, prop) {
                return target[prop]
            },
            set(target, prop, value) {
                target[prop] = value
            }
        })
        this._position = new Proxy(position, {
            get(target, prop) {
                return target[prop]
            },
            set(target, prop, value) {
                target[prop] = value
            }
        })
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
