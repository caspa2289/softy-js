import { Triangle3D } from './Triangle3D'
import { Matrix } from './types'

export class Mesh {
    _triangles: Triangle3D[]

    constructor(triangles: Triangle3D[]) {
        this._triangles = triangles
    }

    public getVisibleTrisSortedByZ(projectionMatrix: Matrix, sWidth: number, sHeight: number) {
        return this.getVisibleTris(projectionMatrix, sWidth, sHeight)
            .sort((t0, t1) => {
                const averageZ0 = (t0.vertexes[0].z + t0.vertexes[1].z + t0.vertexes[2].z) / 3
                const averageZ1 = (t1.vertexes[0].z + t1.vertexes[1].z + t1.vertexes[2].z) / 3

                return averageZ1 - averageZ0
            })
    }

    public getVisibleTris(projectionMatrix: Matrix, sWidth: number, sHeight: number) {
        return this._triangles.reduce((res, triangle) => {
            const projectedTriangle = triangle.getScreenSpaceProjection(projectionMatrix, sWidth, sHeight)

            return projectedTriangle ? [ ...res, projectedTriangle ] : res

        }, [] as Triangle3D[])
    }

    get triangles() {
        return this._triangles
    }

    set triangles(value) {
        this._triangles = value
    }
}
