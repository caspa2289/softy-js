import { CameraProps, Matrix } from '../../common/types'
import { GameObject } from '../gameObject/GameObject'
import { Vector3D } from '../../common/Vector3D'
import { createPointMatrix, hackyInvertMatrix } from '../../common/scripts'

const upDirection = new Vector3D(0, 1, 0)

export class Camera extends GameObject {
    private _targetDirection: Vector3D | null

    constructor({ rotation, position }: CameraProps) {
        super({ rotation, position })
        this._targetDirection = null
    }

    public lookAt(lookDirection: Vector3D) {
        this._targetDirection = this.position.add(lookDirection)
    }

    public get viewMatrix(): Matrix {
        return hackyInvertMatrix(
            createPointMatrix(
                this.position,
                this._targetDirection ?? new Vector3D(0, 0, 1),
                upDirection
            )
        )
    }
}
