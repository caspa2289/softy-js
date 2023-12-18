import testModel from 'bundle-text:../testModel.txt'
import { Vector3D } from '../common/Vector3D'
import { Triangle3D } from '../common/Triangle3D'
import { Mesh } from '../common/Mesh'

export class ObjLoader {
    //FIXME: сделать загрузку по урлу
    static loadFromUrl (): Mesh[] | null {
        const data = testModel.split('\n')

        const vertexes: Vector3D[] = []

        const rawData: { triangles: Triangle3D[] }[] = []

        let current = 0

        data.forEach((line) => {
            if (line[0] === 'o') {
                current++
                rawData[current] = { triangles: [] }
            }

            if (line[0] === 'v') {
                const data = line.split(' ')
                vertexes.push(new Vector3D(data[1], data[2], data[3]))
            }
        })

        data.forEach((line) => {
            if (line[0] === 'f') {
                const data = line.split(' ')
                rawData[current].triangles.push(new Triangle3D({
                    vertexes: [
                        vertexes[data[1] - 1],
                        vertexes[data[2] - 1],
                        vertexes[data[3] - 1],
                    ]
                }))
            }
        })

        return rawData.map((data) => {
            return new Mesh(data.triangles)
        })
    }
}
