import { Vector3D } from '../../common/Vector3D'
import { Matrix, TransformProps } from '../../common/types'
import {
    createRotationXMatrix,
    createRotationYMatrix,
    createRotationZMatrix, multiplyMatrixByMatrix
} from '../../common/scripts'

export class Transform {
    protected _rotationXMatrix: Matrix
    protected _rotationYMatrix: Matrix
    protected _rotationZMatrix: Matrix
    protected _rotationMatrix: Matrix
    private _rotation: Vector3D
    private _position: Vector3D

    constructor({ rotation, position }: TransformProps) {
        this._rotation = rotation
        this._position = position
        this._rotationXMatrix = this._newAxisRotationMatrix('x')
        this._rotationYMatrix = this._newAxisRotationMatrix('y')
        this._rotationZMatrix = this._newAxisRotationMatrix('z')
        this._rotationMatrix = this._createRotationMatrix()
    }

    get rotationMatrix() {
        return this._rotationMatrix
    }

    get rotation() {
        return this._rotation
    }

    get position() {
        return this._position
    }

    set rotation(value: Vector3D) {
        const hasXChanged = this.rotation.x !== value.x
        const hasYChanged = this.rotation.y !== value.y
        const hasZChanged = this.rotation.z !== value.z

        this._rotation = value

        if (hasXChanged) this._updateAxisRotationMatrix('x')
        if (hasYChanged) this._updateAxisRotationMatrix('y')
        if (hasZChanged) this._updateAxisRotationMatrix('z')

        if (hasXChanged || hasYChanged || hasZChanged) {
            this._rotationMatrix = this._createRotationMatrix()
        }
    }

    set position(value: Vector3D) {
        this._position = value
    }

    private _createRotationMatrix() {
        return multiplyMatrixByMatrix(
            this._rotationXMatrix,
            multiplyMatrixByMatrix(
                this._rotationYMatrix,
                this._rotationZMatrix
            )
        )
    }

    private _updateAxisRotationMatrix(axis: 'x' | 'y' | 'z') {
        switch (axis) {
        case 'x': this._rotationXMatrix = this._newAxisRotationMatrix(axis);break
        case 'y': this._rotationYMatrix = this._newAxisRotationMatrix(axis);break
        case 'z': this._rotationZMatrix = this._newAxisRotationMatrix(axis);break
        }
    }

    private _newAxisRotationMatrix(axis: 'x' | 'y' | 'z') {
        switch (axis) {
        case 'x': return createRotationXMatrix(this.rotation.x)
        case 'y': return createRotationYMatrix(this.rotation.y)
        case 'z': return createRotationZMatrix(this.rotation.z)
        }
    }
}
