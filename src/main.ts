import { createProjectionMatrix } from './common/scripts'
import { Rasterizer } from './modules/Rasterizer'
import { ObjLoader } from './modules/ObjLoader'
import { FPCamera } from './components/camera/FPCamera'
import { Vector3D } from './common/Vector3D'
import { GameObject } from './components/gameObject/GameObject'

const CANVAS = document.getElementById('canvas') as HTMLCanvasElement
const CONTEXT = CANVAS.getContext('2d')

const camera = new FPCamera({
    position: new Vector3D(0, 0, 0),
    rotation: new Vector3D(0, 0, 0)
})

window.camera = camera

const {
    viewportAspectRatio,
    fovRadians,
    zFar,
    zNear,
    viewportWidth,
    viewportHeight
} = camera

const projectionMatrix = createProjectionMatrix(viewportAspectRatio, fovRadians, zFar, zNear)

const teapot = new GameObject({
    rotation: new Vector3D(0, 0, 0),
    position: new Vector3D(0, 0, 6),
    meshes: ObjLoader.loadFromUrl()
})

const testData = [ teapot ]

window.addEventListener('keypress', (event) => {
    switch (event.code) {
    case 'KeyW': camera.position.y += 0.1   ;break
    case 'KeyS': camera.position.y -= 0.1   ;break
    case 'KeyA': camera.position.x += 0.1   ;break
    case 'KeyD': camera.position.x -= 0.1   ;break
    case 'KeyQ': camera.rotation =
        new Vector3D(
            camera.rotation.x,
            camera.rotation.y + 0.1,
            camera.rotation.z
        )                                   ;break
    case 'KeyE': camera.rotation =
        new Vector3D(
            camera.rotation.x,
            camera.rotation.y - 0.1,
            camera.rotation.z
        )                                   ;break
    default:                                 break
    }
})

let prevTime = 0

const fpsCounter = document.getElementById('fps')

const update = (
    time: number
) => {
    //FIXME: добавить как дебаг функцию
    fpsCounter.textContent = `FPS: ${(1000 / (time - prevTime)).toFixed(0)}`
    prevTime = time

    Rasterizer.rasterize(testData, projectionMatrix, viewportWidth, viewportHeight, CONTEXT)

    requestAnimationFrame(update)
}

requestAnimationFrame(update)
