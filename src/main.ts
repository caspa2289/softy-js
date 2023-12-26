import { createProjectionMatrix } from './common/scripts'
import { Rasterizer } from './modules/Rasterizer'
import { ObjLoader } from './modules/ObjLoader'
import { Mesh } from './common/Mesh'

const CANVAS = document.getElementById('canvas') as HTMLCanvasElement
const CONTEXT = CANVAS.getContext('2d')
const WIDTH = 640
const HEIGHT = 480
const ASPECT_RATIO = HEIGHT / WIDTH
const Z_FAR = 1000
const Z_NEAR = 0.1
const FOV = 90
const FOV_RADIANS = 1 / Math.tan(FOV * 0.5 / 180 * Math.PI)

const projectionMatrix = createProjectionMatrix(ASPECT_RATIO, FOV_RADIANS, Z_FAR, Z_NEAR)

const testData = ObjLoader.loadFromUrl()

const update = (time: number) => {
    Rasterizer.rasterize(testData as Mesh[], projectionMatrix, WIDTH, HEIGHT, CONTEXT, time / 1000)

    requestAnimationFrame(update)
}

requestAnimationFrame(update)
