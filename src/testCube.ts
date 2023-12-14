import { Mesh } from './common/Mesh'
import { Triangle3D } from './common/Triangle3D'
import { Vector3D } from './common/Vector3D'

export const testCube = new Mesh([
    //south
    new Triangle3D({
        vertexes: [
            new Vector3D(0, 1, 0),
            new Vector3D(0, 0, 0),
            new Vector3D(1, 0, 0),
        ]
    }),
    new Triangle3D({
        vertexes: [
            new Vector3D(0, 1, 0),
            new Vector3D(1, 0, 0),
            new Vector3D(1, 1, 0),
        ]
    }),

    //east
    new Triangle3D({
        vertexes: [
            new Vector3D(1, 1, 0),
            new Vector3D(1, 0, 0),
            new Vector3D(1, 0, 1),
        ]
    }),
    new Triangle3D({
        vertexes: [
            new Vector3D(1, 1, 0),
            new Vector3D(1, 0, 1),
            new Vector3D(1, 1, 1),
        ]
    }),

    //north
    new Triangle3D({
        vertexes: [
            new Vector3D(1, 1, 1),
            new Vector3D(1, 0, 1),
            new Vector3D(0, 0, 1),
        ]
    }),
    new Triangle3D({
        vertexes: [
            new Vector3D(1, 1, 1),
            new Vector3D(0, 0, 1),
            new Vector3D(0, 1, 1),
        ]
    }),

    //west
    new Triangle3D({
        vertexes: [
            new Vector3D(0, 1, 1),
            new Vector3D(0, 0, 1),
            new Vector3D(0, 0, 0),
        ]
    }),
    new Triangle3D({
        vertexes: [
            new Vector3D(0, 1, 1),
            new Vector3D(0, 0, 0),
            new Vector3D(0, 1, 0),
        ]
    }),

    //top
    new Triangle3D({
        vertexes: [
            new Vector3D(0, 0, 0),
            new Vector3D(0, 0, 1),
            new Vector3D(0, 0, 1),
        ]
    }),
    new Triangle3D({
        vertexes: [
            new Vector3D(0, 0, 0),
            new Vector3D(1, 0, 1),
            new Vector3D(1, 0, 0),
        ]
    }),

    //bottom
    new Triangle3D({
        vertexes: [
            new Vector3D(1, 1, 1),
            new Vector3D(0, 1, 1),
            new Vector3D(0, 1, 0),
        ]
    }),
    new Triangle3D({
        vertexes: [
            new Vector3D(1, 1, 1),
            new Vector3D(0, 1, 0),
            new Vector3D(1, 1, 0),
        ]
    }),
])
