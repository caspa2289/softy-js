export class Vector3D {
    x: number
    y: number
    z: number
    w: number

    constructor(x: number, y: number, z: number, w = 1) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    add(otherVec: Vector3D): Vector3D {
        return new Vector3D(
            this.x + otherVec.x,
            this.y + otherVec.y,
            this.z + otherVec.z,
            this.w
        )
    }

    subtract(otherVec: Vector3D): Vector3D {
        return new Vector3D(
            this.x - otherVec.x,
            this.y - otherVec.y,
            this.z - otherVec.z,
            this.w
        )
    }
}
