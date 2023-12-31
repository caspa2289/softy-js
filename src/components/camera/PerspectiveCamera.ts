import { PerspectiveCameraOptions, CameraProps, ENTITY_TYPES } from '../../common/types'
import { GameObject } from '../gameObject/GameObject'
import { Vector3D } from '../../common/Vector3D'
import {
    createPointMatrix,
    getCrossProduct,
    getDotProduct3D, hackyInvertMatrix,
    multiplyVectorByMatrix,
    multiplyVectorByScalar,
    normalizeVector3D
} from '../../common/scripts'

//FIXME: верх почему-то -Y, скорее всего дело в том, что на канвасе отсчёт от левого верхнего угла идёт.
//Не уверен, что это проблема вообще
const upDirection = new Vector3D(0, -1, 0)

const defaultCameraOptions = {
    viewportWidth: 640,
    viewportHeight: 480,
    zFar: 1000,
    zNear: 0.1,
    fov: 75
}

type RequiredCameraOptions = Required<PerspectiveCameraOptions>

export class PerspectiveCamera extends GameObject {
    private _forward: Vector3D
    private _viewportWidth: RequiredCameraOptions['viewportWidth']
    private _viewportHeight: RequiredCameraOptions['viewportHeight']
    private _zFar: RequiredCameraOptions['zFar']
    private _zNear: RequiredCameraOptions['zNear']
    private _fov: RequiredCameraOptions['fov']

    constructor({ rotation, position, options }: CameraProps) {
        super({ rotation, position })

        this._forward = new Vector3D(0, 0, 1)
        this._viewportWidth = options?.viewportWidth ?? defaultCameraOptions.viewportWidth
        this._viewportHeight = options?.viewportHeight ?? defaultCameraOptions.viewportHeight
        this._zFar = options?.zFar ?? defaultCameraOptions.zFar
        this._zNear = options?.zNear ?? defaultCameraOptions.zNear
        this._fov = options?.fov ?? defaultCameraOptions.fov
        this._type = ENTITY_TYPES.Camera
    }

    public get viewportWidth() {
        return this._viewportWidth
    }

    public set viewportWidth(value: RequiredCameraOptions['viewportWidth']) {
        this._viewportWidth = value
    }

    public get viewportHeight() {
        return this._viewportHeight
    }

    public set viewportHeight(value: RequiredCameraOptions['viewportHeight']) {
        this._viewportHeight = value
    }

    public get zFar() {
        return this._zFar
    }

    public set zFar(value: RequiredCameraOptions['zFar']) {
        this._zFar = value
    }

    public get zNear() {
        return this._zNear
    }

    public set zNear(value: RequiredCameraOptions['zNear']) {
        this._zNear = value
    }

    public set fov(value: RequiredCameraOptions['fov']) {
        this._fov = value
    }

    public get fov() {
        return this._fov
    }

    public get viewportAspectRatio() {
        return this._viewportHeight / this._viewportWidth
    }

    public get fovRadians() {
        return 1 / Math.tan(this._fov * 0.5 / 180 * Math.PI)
    }

    public setForwardDirection(lookDirection: Vector3D) {
        this._forward = lookDirection
    }

    public get localAxis(): { forward: Vector3D, right: Vector3D, up: Vector3D, position: Vector3D } {
        const rotationMatrix = this.transform.rotationMatrix

        const lookDirection = multiplyVectorByMatrix(this._forward, rotationMatrix)

        const lookTarget = this.position.add(lookDirection)

        const forward = normalizeVector3D(lookTarget.subtract(this.position))
        const up = normalizeVector3D(
            upDirection.subtract(
                multiplyVectorByScalar(
                    forward,
                    getDotProduct3D(upDirection, forward)
                )
            )
        )

        const right = getCrossProduct(up, forward)

        return { forward, up, right, position: this.position }
    }

    public get viewMatrix() {
        const { position, right, up, forward } = this.localAxis

        return hackyInvertMatrix(
            createPointMatrix(position, right, up, forward)
        )
    }
}
