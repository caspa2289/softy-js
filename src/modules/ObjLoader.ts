import testModel from 'bundle-text:../axis.obj'
import { Vector3D } from '../common/Vector3D'
import { Triangle3D } from '../common/Triangle3D'
import { Mesh } from '../common/Mesh'

export class ObjLoader {
    //FIXME: сделать загрузку по урлу
    static loadFromUrl (): Mesh[] | null {
        const data = testModel.split('\n')

        const vertexes: Vector3D[] = []

        //FIXME: a bit of a hack
        const rawData: { triangles: Triangle3D[] }[] = [ {triangles: []} ]

        let current = 0

        data.forEach((line) => {
            if (line[0] === 'o') {
                current++
                rawData[current] = { triangles: [] }
            }

            if (line[0] === 'v') {
                const data = line.split(' ')
                vertexes.push(new Vector3D(Number(data[1]), Number(data[2]), Number(data[3])))
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
