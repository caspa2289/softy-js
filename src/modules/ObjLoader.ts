import testModel from 'bundle-text:../testModel.obj'
import { Vector3D } from '../common/Vector3D'
import { Triangle3D } from '../common/Triangle3D'
import { Mesh } from '../common/Mesh'
import { Vector2D } from '../common/Vector2D'
import testTexture from '../cubetexture.jpg'

export class ObjLoader {
    private static async _loadTextureData() {
        const response = await fetch(testTexture)
        const fileBlob = await response.blob()
        const bitmap = await createImageBitmap(fileBlob)
        const offScreenCanvas = document.createElement('canvas')
        const offScreenCanvasContext = offScreenCanvas.getContext('2d')
        offScreenCanvas.width = bitmap.width
        offScreenCanvas.height = bitmap.height
        offScreenCanvasContext.drawImage(bitmap, 0, 0 )

        return offScreenCanvasContext.getImageData(0, 0, offScreenCanvas.width, offScreenCanvas.height)
    }

    //FIXME: сделать загрузку по урлу
    static async loadFromUrl () {
        const data = testModel.split('\n')

        const vertexes: Vector3D[] = []

        //FIXME: a bit of a hack
        const rawData: { triangles: Triangle3D[] }[] = [ {triangles: []} ]

        const UVCoordinates: Vector2D[] = []
        let textureData: ImageData | undefined  = undefined

        let current = 0

        data.forEach((line) => {
            if (line[0] === 'o') {
                current++
                rawData[current] = { triangles: [] }
            }

            if (line[0] === 'v') {
                if (line[1] === 't') {
                    const data = line.split(' ')
                    UVCoordinates.push(new Vector2D(Number(data[1]), Number(data[2])))
                } else {
                    const data = line.split(' ')
                    vertexes.push(new Vector3D(Number(data[1]), Number(data[2]), Number(data[3])))
                }
            }
        })

        data.forEach((line) => {
            if (line[0] === 'f') {
                if (UVCoordinates.length === 0) {
                    const data = line.split(' ')
                    rawData[current].triangles.push(new Triangle3D({
                        vertexes: [
                            vertexes[data[1] - 1],
                            vertexes[data[2] - 1],
                            vertexes[data[3] - 1],
                        ],
                        UVCoordinates: [
                            new Vector2D(0, 0),
                            new Vector2D(0, 0),
                            new Vector2D(0, 0)
                        ]
                    }))
                } else {
                    const data = line.split(' ').map((el) => {
                        return el.split('/')
                    })

                    rawData[current].triangles.push(new Triangle3D({
                        vertexes: [
                            vertexes[data[1][0] - 1],
                            vertexes[data[2][0] - 1],
                            vertexes[data[3][0] - 1],
                        ],
                        UVCoordinates: [
                            UVCoordinates[data[1][1] - 1],
                            UVCoordinates[data[2][1] - 1],
                            UVCoordinates[data[3][1] - 1],
                        ]
                    }))
                }
            }
        })

        if (UVCoordinates.length !== 0) {
            textureData = await this._loadTextureData()
        }

        return rawData.map((data) => {
            return new Mesh(data.triangles, textureData)
        })
    }
}
