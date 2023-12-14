import { Vector3D } from './Vector3D'
import { Matrix } from './types'

export const multiplyMatrixByVector = (vec3D: Vector3D, matrix: Matrix) => {
    const x = vec3D.x * matrix[0][0] + vec3D.y * matrix[1][0] + vec3D.z * matrix[2][0] + matrix[3][0]
    const y = vec3D.x * matrix[0][1] + vec3D.y * matrix[1][1] + vec3D.z * matrix[2][1] + matrix[3][1]
    const z = vec3D.x * matrix[0][2] + vec3D.y * matrix[1][2] + vec3D.z * matrix[2][2] + matrix[3][2]
    const w = vec3D.x * matrix[0][3] + vec3D.y * matrix[1][3] + vec3D.z * matrix[2][3] + matrix[3][3]

    if (w !== 0) {
        return new Vector3D(x/w, y/w, z/w)
    } else {
        return new Vector3D(x, y, z)
    }
}

export const getProjectionMatrix = (
    aspectRatio: number,
    fovRad: number,
    zFar: number,
    zNear: number
): Matrix => {
    return [
        [ aspectRatio * fovRad, 0, 0, 0 ],
        [ 0, fovRad, 0, 0 ],
        [ 0, 0, zFar / (zFar - zNear), 1 ],
        [ 0, 0, (-zFar * zNear) / (zFar - zNear), 0 ],
    ]
}
