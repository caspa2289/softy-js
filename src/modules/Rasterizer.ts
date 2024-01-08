import { Vector3D } from '../common/Vector3D'
import { ENTITY_TYPES, Matrix } from '../common/types'
import { Triangle3D } from '../common/Triangle3D'
import {
    clipTriangleAgainstPlane,
    createWorldMatrix,
    getCrossProduct,
    getDotProduct3D,
    getPixelData,
    normalizeVector3D
} from '../common/scripts'
import { PerspectiveCamera } from '../components/camera/PerspectiveCamera'
import { GameObject } from '../components/gameObject/GameObject'

type VertData = {
    x: number,
    y: number,
    u: number,
    v: number,
    w: number
}

export class Rasterizer {
    static rasterize(
        data: GameObject[],
        projectionMatrix: Matrix,
        sWidth: number,
        sHeight: number,
        context: CanvasRenderingContext2D,
    ) {
        //FIXME: плейсхолдер
        const camera: PerspectiveCamera = window.camera as PerspectiveCamera

        const clippingPlanes = [
            { point: new Vector3D(0, 0, 0), normal: new Vector3D(0, 1, 0) },
            { point: new Vector3D(0, camera.viewportHeight - 1, 0), normal: new Vector3D(0, -1, 0) },
            { point: new Vector3D(0, 0, 0), normal: new Vector3D(1, 0, 0) },
            { point: new Vector3D(camera.viewportWidth - 1, 0, 0), normal: new Vector3D(-1, 0, 0) }
        ]

        //FIXME: это скорее всего очень медленно
        window.depthBuffer = new Array(context.canvas.width * context.canvas.height).fill(0)
        const imageData = context.createImageData(context.canvas.width, context.canvas.height)

        data.forEach((gameObject) => {
            const worldMatrix = createWorldMatrix(gameObject.rotation, gameObject.position)

            gameObject.getChildrenByType(ENTITY_TYPES.Mesh).forEach((mesh) => {
                const viewMatrix = camera.viewMatrix

                const clippedTriangles = mesh.triangles.reduce((res, triangle) => {
                    const translatedTriangle = triangle.getCopy()

                    translatedTriangle.applyMatrixMut(worldMatrix)

                    const line1 = translatedTriangle.vertexes[1].subtract(translatedTriangle.vertexes[0])
                    const line2 = translatedTriangle.vertexes[2].subtract(translatedTriangle.vertexes[0])

                    const normal = normalizeVector3D(getCrossProduct(line1, line2))

                    const cameraDotProduct = getDotProduct3D(
                        normal,
                        translatedTriangle.vertexes[0].subtract(camera.position)
                    )

                    if (cameraDotProduct >= 0 || isNaN(cameraDotProduct)) {
                        return res
                    }

                    translatedTriangle.applyMatrixMut(viewMatrix)

                    //Clip triangle against near plane
                    const clippedTriangles = clipTriangleAgainstPlane(
                        new Vector3D(0, 0, camera.zNear),
                        new Vector3D(0, 0, 1),
                        translatedTriangle
                    ).map((triangle) => {
                        triangle.normal = normal

                        return triangle
                            .applyMatrixMut(projectionMatrix)
                            .normalizeInScreenSpaceMut(sWidth, sHeight)
                    }, [] as Triangle3D[])

                    return [ ...res, ...clippedTriangles ]
                }, [] as Triangle3D[])

                let screenSpaceClippedTriangles: Triangle3D[] = clippedTriangles

                clippingPlanes.forEach(({ point, normal }) => {
                    screenSpaceClippedTriangles = screenSpaceClippedTriangles.reduce((res, triangle) => {
                        return [ ...res, ...clipTriangleAgainstPlane(
                            point,
                            normal,
                            triangle
                        ) ]
                    }, [] as Triangle3D[])
                })

                screenSpaceClippedTriangles.forEach((triangle) => {
                    this._generateTriangleData(
                        triangle,
                        context.canvas.width,
                        imageData,
                        mesh.texture
                    )
                })
            })

            context.putImageData(imageData, 0, 0)
        })
    }

    private static _setPixelData(value: [number, number, number, number], x: number, y: number, imageData: ImageData) {
        imageData.data[y * (imageData.width * 4) + x * 4] = value[0]
        imageData.data[y * (imageData.width * 4) + x * 4 + 1] = value[1]
        imageData.data[y * (imageData.width * 4) + x * 4 + 2] = value[2]
        imageData.data[y * (imageData.width * 4) + x * 4 + 3] = value[3]
    }

    private static _generateTriangleData(
        triangle: Triangle3D,
        screenWidth: number,
        imageData: ImageData,
        textureData?: ImageData
    ) {
        const fillPixels = (
            i: number, aX: number, bX: number,
            sU: number, sV: number, sW: number,
            u2Step: number, v2Step: number, w2Step: number,
            vertData: VertData[],
        ) => {
            //ending values
            let eU = vertData[0].u + (i - vertData[0].y) * u2Step
            let eV = vertData[0].v + (i - vertData[0].y) * v2Step
            let eW = vertData[0].w + (i - vertData[0].y) * w2Step

            if (aX > bX) {
                [ aX, bX ] = [ bX, aX ];
                [ sU, eU ] = [ eU, sU ];
                [ sV, eV ] = [ eV, sV ];
                [ sW, eW ] = [ eW, sW ]
            }

            let t = 0
            const tStep = 1 / (bX - aX)

            let [ textureU, textureV, textureW ] = [ sU, sV, sW ]

            for (let j = aX; j < bX; j++) {
                textureU = (1 - t) * sU + t * eU
                textureV = (1 - t) * sV + t * eV
                textureW = (1 - t) * sW + t * eW

                const intI = Math.round(i)
                const intJ = Math.round(j)
                const pixelIndex = intI * screenWidth + intJ

                //FIXME: убрать это из window
                if (textureW > window.depthBuffer[pixelIndex]) {
                    //FIXME: говно какое-то
                    let texturePixelData
                    if ((intJ === aX || intJ + 1 >= bX || intJ >= bX)) {
                        texturePixelData = [ 0, 255, 0, 255 ]
                    } else {
                        texturePixelData = textureData
                            ? getPixelData(
                                textureData,
                                (textureU / textureW),
                                (textureV / textureW)
                            )
                            : [ 255, 0, 255, 255 ]
                    }

                    this._setPixelData(texturePixelData, intJ, intI, imageData)

                    window.depthBuffer[pixelIndex] = textureW
                }

                t += tStep
            }
        }

        const vertData: VertData[] = [
            {
                x: triangle.vertexes[0].x,
                y: triangle.vertexes[0].y,
                u: triangle.UVCoordinates[0].u,
                v: triangle.UVCoordinates[0].v,
                w: triangle.UVCoordinates[0].w
            },
            {
                x: triangle.vertexes[1].x,
                y: triangle.vertexes[1].y,
                u: triangle.UVCoordinates[1].u,
                v: triangle.UVCoordinates[1].v,
                w: triangle.UVCoordinates[1].w
            },
            {
                x: triangle.vertexes[2].x,
                y: triangle.vertexes[2].y,
                u: triangle.UVCoordinates[2].u,
                v: triangle.UVCoordinates[2].v,
                w: triangle.UVCoordinates[2].w
            }
        ].sort((a, b) => a.y - b.y)

        let dy1 = Math.round(vertData[1].y - vertData[0].y)
        let dx1 = Math.round(vertData[1].x - vertData[0].x)
        let dv1 = vertData[1].v - vertData[0].v
        let du1 = vertData[1].u - vertData[0].u
        let dw1 = vertData[1].w - vertData[0].w

        const dy2 = Math.round(vertData[2].y - vertData[0].y)
        const dx2 = Math.round(vertData[2].x - vertData[0].x)
        const dv2 = vertData[2].v - vertData[0].v
        const du2 = vertData[2].u - vertData[0].u
        const dw2 = vertData[2].w - vertData[0].w

        let xStep1 = 0, xStep2 = 0, u1Step = 0,
            v1Step = 0, u2Step = 0, v2Step = 0,
            w1Step = 0, w2Step = 0

        if (dy1) xStep1 = dx1 / Math.abs(dy1)
        if (dy2) xStep2 = dx2 / Math.abs(dy2)

        if (dy1) u1Step = du1 / Math.abs(dy1)
        if (dy1) v1Step = dv1 / Math.abs(dy1)
        if (dy1) w1Step = dw1 / Math.abs(dy1)

        if (dy2) u2Step = du2 / Math.abs(dy2)
        if (dy2) v2Step = dv2 / Math.abs(dy2)
        if (dy2) w2Step = dw2 / Math.abs(dy2)

        if (dy1) {
            for (let i = vertData[0].y; i <= vertData[1].y; i++) {

                let aX = Math.round(vertData[0].x + (i - vertData[0].y) * xStep1)
                let bX = Math.round(vertData[0].x + (i - vertData[0].y) * xStep2)

                //starting values
                let sU = vertData[0].u + (i - vertData[0].y) * u1Step
                let sV = vertData[0].v + (i - vertData[0].y) * v1Step
                let sW = vertData[0].w + (i - vertData[0].y) * w1Step


                fillPixels(i, aX, bX, sU, sV, sW, u2Step, v2Step, w2Step, vertData)
            }
        }

        dy1 = Math.round(vertData[2].y - vertData[1].y)
        dx1 = Math.round(vertData[2].x - vertData[1].x)
        dv1 = vertData[2].v - vertData[1].v
        du1 = vertData[2].u - vertData[1].u
        dw1 = vertData[2].w - vertData[1].w

        if (dy1) xStep1 = dx1 / Math.abs(dy1)
        if (dy2) xStep2 = dx2 / Math.abs(dy2)

        u1Step = 0
        v1Step = 0

        if (dy1) u1Step = du1 / Math.abs(dy1)
        if (dy1) v1Step = dv1 / Math.abs(dy1)
        if (dy1) w1Step = dw1 / Math.abs(dy1)

        if (dy1) {
            for (let i = vertData[1].y; i <= vertData[2].y; i++) {
                let aX = Math.round(vertData[1].x + (i - vertData[1].y) * xStep1)
                let bX = Math.round(vertData[0].x + (i - vertData[0].y) * xStep2)

                //starting values
                let sU = vertData[1].u + (i - vertData[1].y) * u1Step
                let sV = vertData[1].v + (i - vertData[1].y) * v1Step
                let sW = vertData[1].w + (i - vertData[1].y) * w1Step

                fillPixels(i, aX, bX, sU, sV, sW, u2Step, v2Step, w2Step, vertData)
            }
        }
    }
}
