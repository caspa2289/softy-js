import { Vector3D } from './Vector3D'
import { Mesh } from './Mesh'

export type Matrix = number[][]

export type TransformProps = {
    position: Vector3D
    rotation: Vector3D
}

export type GameObjectProps = TransformProps & {
    meshes?: Mesh[] | null
}

export type PerspectiveCameraOptions = {
    viewportWidth?: number
    viewportHeight?: number
    zFar?: number
    zNear?: number
    fov?: number
}

export type CameraProps = GameObjectProps & {
    options?: PerspectiveCameraOptions
}

export enum ENTITY_TYPES {
    GameObject = 'GameObject',
    Mesh = 'Mesh',
    Camera = 'Camera',
    Entity = 'Entity'
}

export type EntityType = keyof typeof ENTITY_TYPES


