import { createProjectionMatrix } from './common/scripts'
import { Rasterizer } from './modules/Rasterizer'
import { ObjLoader } from './modules/ObjLoader'
import { Mesh } from './common/Mesh'
import { FPCamera } from './components/camera/FPCamera'
import { Vector3D } from './common/Vector3D'

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

const camera = new FPCamera({
    position: new Vector3D(0, 0, 0),
    rotation: new Vector3D(0, 0, 0)
})

//FIXME: поправить потом
window.camera = camera

window.addEventListener('keypress', (event) => {
    if (event.code === 'KeyW') {
        //FIXME: надо придумать как обойтись без мутаций, или в трансформе сделать отдельные поля x, y, z
        camera.position.y += 0.1
    }

    if (event.code === 'KeyS') {
        camera.position.y -= 0.1
    }

    if (event.code === 'KeyA') {
        camera.position.x += 0.1
    }

    if (event.code === 'KeyD') {
        camera.position.x -= 0.1
    }
})

const update = (
    // time: number
) => {
    Rasterizer.rasterize(testData as Mesh[], projectionMatrix, WIDTH, HEIGHT, CONTEXT)

    requestAnimationFrame(update)
}

requestAnimationFrame(update)
