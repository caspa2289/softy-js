import { CameraProps, Matrix } from '../../common/types'
import { GameObject } from '../gameObject/GameObject'
import { Vector3D } from '../../common/Vector3D'
import { createPointMatrix, hackyInvertMatrix } from '../../common/scripts'

//FIXME: верх почему-то -Y, скорее всего дело в том, что на канвасе отсчёт от левого верхнего угла идёт.
//Не уверен, что это проблема вообще
const upDirection = new Vector3D(0, -1, 0)

export class Camera extends GameObject {
    private _lookAtTarget: Vector3D

    constructor({ rotation, position }: CameraProps) {
        super({ rotation, position })

        this._lookAtTarget = new Vector3D(0, 0, 1)
    }

    public lookAt(lookDirection: Vector3D) {
        this._lookAtTarget = lookDirection
    }

    public get viewMatrix(): Matrix {
        return hackyInvertMatrix(
            createPointMatrix(this.position, this.position.add(this._lookAtTarget), upDirection)
        )
    }
}
