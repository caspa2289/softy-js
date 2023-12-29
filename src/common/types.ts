import { Vector3D } from './Vector3D'
import {Mesh} from './Mesh'

export type Matrix = number[][]

export type TransformProps = {
    position: Vector3D
    rotation: Vector3D
}

export type GameObjectProps = TransformProps & {
    meshes?: Mesh[] | null
}

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

