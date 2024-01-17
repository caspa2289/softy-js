import testModel from 'bundle-text:../texturedCube.obj'
import testTexture from '../cubetexture.jpg'
import init, {Vector3, Vector2, Mesh} from 'softy-engine'

type Vec3 = {
    x: number,
    y: number,
    z: number,
    w: number
}

type Vec2 = {
    u: number,
    v: number,
    w: number
}

type Tri3 = {
    vertexes: Vec3[],
    uv_coords: Vec2[],
    normal: Vec3
}

export class ObjLoader {
    private static async _loadTextureData() {
        const response = await fetch(testTexture)
        const fileBlob = await response.blob()
        const bitmap = await createImageBitmap(fileBlob)
        const offScreenCanvas = document.createElement('canvas')
        const offScreenCanvasContext = offScreenCanvas.getContext('2d') as CanvasRenderingContext2D
        offScreenCanvas.width = bitmap.width
        offScreenCanvas.height = bitmap.height
        offScreenCanvasContext.drawImage(bitmap, 0, 0 )

        return offScreenCanvasContext.getImageData(0, 0, offScreenCanvas.width, offScreenCanvas.height)
    }

    //FIXME: сделать загрузку по урлу
    static async loadFromUrl () {

        await init()

        const data = testModel.split('\n') as string[]

        const vertexes: Vec3[] = []
        const rawData: { triangles: Tri3[] }[] = []
        const UVCoordinates: Vec2[] = []
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
                    UVCoordinates.push(Vector2.new(Number(data[1]), Number(data[2]), 1))
                } else {
                    const data = line.split(' ')
                    vertexes.push(Vector3.new(Number(data[1]), Number(data[2]), Number(data[3])))
                }
            }
        })

        data.forEach((line) => {
            if (line[0] === 'f') {
                if (UVCoordinates.length === 0) {
                    const data = line.split(' ')
                    rawData[current].triangles.push({
                        vertexes: [
                            vertexes[Number(data[1]) - 1],
                            vertexes[Number(data[2]) - 1],
                            vertexes[Number(data[3]) - 1],
                        ],
                        uv_coords: [
                            Vector2.new(0, 0, 0),
                            Vector2.new(0, 0, 0),
                            Vector2.new(0, 0, 0),
                        ],
                        normal: Vector3.new(0, 0, 0)
                    })
                } else {
                    const data = line.split(' ').map((el) => {
                        return el.split('/')
                    })

                    rawData[current].triangles.push({
                        vertexes: [
                            vertexes[Number(data[1][0]) - 1],
                            vertexes[Number(data[2][0]) - 1],
                            vertexes[Number(data[3][0]) - 1],
                        ],
                        uv_coords: [
                            UVCoordinates[Number(data[1][1]) - 1],
                            UVCoordinates[Number(data[2][1]) - 1],
                            UVCoordinates[Number(data[3][1]) - 1],
                        ],
                        normal: Vector3.new(0, 0, 0)
                    })
                }
            }
        })

        if (UVCoordinates.length !== 0) {
            textureData = await this._loadTextureData()
        }

        return rawData.map((data) => {
            return Mesh.new(data.triangles, new Uint8Array(textureData?.data ?? []), textureData?.height, textureData?.width)
        })
    }
}
