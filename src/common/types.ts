import { Vector3D } from './Vector3D'

export type Matrix = number[][]

export type TransformProps = {
    position: Vector3D
    rotation: Vector3D
}

export type GameObjectProps = TransformProps

export type CameraProps = GameObjectProps

export type FPCameraProps = CameraProps

