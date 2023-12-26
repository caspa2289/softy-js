export class Vector3D {
    x: number
    y: number
    z: number

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    add(otherVec: Vector3D): Vector3D {
        return new Vector3D(
            this.x + otherVec.x,
            this.y + otherVec.y,
            this.z + otherVec.z
        )
    }

    subtract(otherVec: Vector3D): Vector3D {
        return new Vector3D(
            this.x - otherVec.x,
            this.y - otherVec.y,
            this.z - otherVec.z
        )
    }
}
