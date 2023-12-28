import { Vector3D } from './Vector3D'
import { Matrix } from './types'

export const getLengthVector3D = (vector: Vector3D) => {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z)
}

export const normalizeVector3D = (vector: Vector3D) => {
    const length = getLengthVector3D(vector)

    return new Vector3D(vector.x / length, vector.y / length, vector.z / length)
}

export const getDotProduct3D = (vec1: Vector3D, vec2: Vector3D) => {
    return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z
}

export const getCrossProduct = (v0: Vector3D, v1: Vector3D): Vector3D => {
    return new Vector3D(
        v0.y * v1.z - v0.z * v1.y,
        v0.z * v1.x - v0.x * v1.z,
        v0.x * v1.y - v0.y * v1.x
    )
}

export const createIdentityMatrix = (): Matrix => {
    return [
        [ 1, 0, 0, 0 ],
        [ 0, 1, 0, 0 ],
        [ 0, 0, 1, 0 ],
        [ 0, 0, 0, 1 ],
    ]
}

export const createRotationXMatrix = (angleRad: number): Matrix => {
    return [
        [ 1, 0, 0, 0 ],
        [ 0, Math.cos(angleRad), Math.sin(angleRad), 0 ],
        [ 0, -Math.sin(angleRad), Math.cos(angleRad), 0 ],
        [ 0, 0, 0, 1 ],
    ]
}

export const createRotationZMatrix = (angleRad: number): Matrix => {
    return [
        [ Math.cos(angleRad), Math.sin(angleRad), 0, 0 ],
        [ -Math.sin(angleRad), Math.cos(angleRad), 0, 0 ],
        [ 0, 0, 1, 0 ],
        [ 0, 0, 0, 1 ],
    ]
}

export const createRotationYMatrix = (angleRad: number): Matrix => {
    return [
        [ Math.cos(angleRad), 0, Math.sin(angleRad), 0 ],
        [ 0, 1, 0, 0 ],
        [ -Math.sin(angleRad), 0, Math.cos(angleRad), 0 ],
        [ 0, 0, 0, 1 ],
    ]
}

export const createTranslationMatrix = (x: number, y: number, z: number): Matrix => {
    return [
        [ 1, 0, 0, 0 ],
        [ 0, 1, 0, 0 ],
        [ 0, 0, 1, 0 ],
        [ x, y, z, 1 ],
    ]
}

export const createProjectionMatrix = (
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

export const createWorldMatrix = (rotation: Vector3D, position: Vector3D) => {
    const zRotationMatrix = createRotationZMatrix(rotation.z)
    const xRotationMatrix = createRotationXMatrix(rotation.x)
    const yRotationMatrix = createRotationYMatrix(rotation.y)
    const translationMatrix = createTranslationMatrix(position.x, position.y, position.z)

    //FIXME: зарефачить
    return multiplyMatrixByMatrix(
        multiplyMatrixByMatrix(
            multiplyMatrixByMatrix(
                zRotationMatrix,
                xRotationMatrix
            ),
            yRotationMatrix
        ),
        translationMatrix
    )
}

export const multiplyVectorByMatrix = (vec3D: Vector3D, matrix: Matrix) => {
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

export const multiplyMatrixByMatrix = (m0: Matrix, m1: Matrix): Matrix => {
    const matrix = [ [], [], [], [] ]

    for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 4; r++) {
            matrix[r][c] = m0[r][0] * m1[0][c] + m0[r][1] * m1[1][c] + m0[r][2] * m1[2][c] + m0[r][3] * m1[3][c]
        }
    }

    return matrix
}

export const createPointMatrix = (position: Vector3D, target: Vector3D, up: Vector3D): Matrix => {
    const newForward = normalizeVector3D(target.subtract(position))
    const newUp = normalizeVector3D(
        up.subtract(
            multiplyVectorByScalar(
                newForward,
                getDotProduct3D(up, newForward)
            )
        )
    )
    const newRight = getCrossProduct(newUp, newForward)

    return [
        [ newRight.x, newRight.y, newRight.z, 0 ],
        [ newUp.x, newUp.y, newUp.z, 0 ],
        [ newForward.x,  newForward.y, newForward.z, 0 ],
        [ position.x, position.y, position.z, 1 ],
    ]
}

export const hackyInvertMatrix = (m: Matrix): Matrix => { //Works only for rotation ot translation matrices
    //FIXME: i have no idea why it works
    return [
        [ m[0][0], m[1][0], m[2][0], 0 ],
        [ m[0][1], m[1][1], m[2][1], 0 ],
        [ m[0][2], m[1][2], m[2][2], 0 ],
        [
            -(m[3][0] * m[0][0] + m[3][1] * m[0][1] + m[3][2] * m[0][2]),
            -(m[3][0] * m[1][0] + m[3][1] * m[1][1] + m[3][2] * m[1][2]),
            -(m[3][0] * m[2][0] + m[3][1] * m[2][1] + m[3][2] * m[2][2]),
            1
        ],
    ]
}

export const multiplyVectorByScalar = (v: Vector3D, scalar: number): Vector3D => {
    return new Vector3D(v.x * scalar, v.y * scalar, v.z * scalar )
}
