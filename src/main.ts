import { getProjectionMatrix } from './common/scripts'
import { Rasterizer } from './modules/Rasterizer'
import { testCube } from './testCube'

const CANVAS = document.getElementById('canvas') as HTMLCanvasElement
const CONTEXT = CANVAS.getContext('2d')
const WIDTH = 640
const HEIGHT = 480
const ASPECT_RATIO = HEIGHT / WIDTH
const Z_FAR = 1000
const Z_NEAR = 0.1
const FOV = 90
const FOV_RADIANS = 1 / Math.tan(FOV * 0.5 / 180 * Math.PI)

const projectionMatrix = getProjectionMatrix(ASPECT_RATIO, FOV_RADIANS, Z_FAR, Z_NEAR)

Rasterizer.rasterize([ testCube ], projectionMatrix, WIDTH, HEIGHT, CONTEXT)
