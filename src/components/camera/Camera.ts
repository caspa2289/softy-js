import { CameraProps, Matrix } from '../../common/types'
import { GameObject } from '../gameObject/GameObject'
import { Vector3D } from '../../common/Vector3D'
import {
    createPointMatrix,
    createRotationYMatrix,
    hackyInvertMatrix,
    multiplyVectorByMatrix
} from '../../common/scripts'

//FIXME: верх почему-то -Y, скорее всего дело в том, что на канвасе отсчёт от левого верхнего угла идёт.
//Не уверен, что это проблема вообще
const upDirection = new Vector3D(0, -1, 0)

export class Camera extends GameObject {
    private _forward: Vector3D
    yaw: number

    constructor({ rotation, position }: CameraProps) {
        super({ rotation, position })

        this.yaw = 0
        this._forward = new Vector3D(0, 0, 1)
    }

    public setForwardDirection(lookDirection: Vector3D) {
        this._forward = lookDirection
    }

    public get viewMatrix(): Matrix {
        const cameraRotationYMatrix = createRotationYMatrix(this.yaw)

        const lookDirection = multiplyVectorByMatrix(this._forward, cameraRotationYMatrix)

        const lookTarget = this.position.add(lookDirection)

        return hackyInvertMatrix(
            createPointMatrix(this.position, lookTarget, upDirection)
        )
    }
}
