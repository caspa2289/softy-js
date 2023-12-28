import { Vector3D } from './Vector3D'

export type Matrix = number[][]

export type TransformProps = {
    position: Vector3D
    rotation: Vector3D
}

export type GameObjectProps = TransformProps

export type CameraOptions = {
    viewportWidth?: number
    viewportHeight?: number
    zFar?: number
    zNear?: number
    fov?: number
}

export type CameraProps = GameObjectProps & {
    options?: CameraOptions
}

export type FPCameraProps = CameraProps

