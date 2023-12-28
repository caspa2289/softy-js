import { createProjectionMatrix } from './common/scripts'
import { Rasterizer } from './modules/Rasterizer'
import { ObjLoader } from './modules/ObjLoader'
import { Mesh } from './common/Mesh'
import { FPCamera } from './components/camera/FPCamera'
import { Vector3D } from './common/Vector3D'

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

const testData = ObjLoader.loadFromUrl()

//FIXME: поправить потом
window.addEventListener('keypress', (event) => {
    if (event.code === 'KeyW') {
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

    if (event.code === 'KeyQ') {
        camera.yaw += 0.1
    }

    if (event.code === 'KeyE') {
        camera.yaw -= 0.1
    }
})

const update = (
    // time: number
) => {
    Rasterizer.rasterize(testData as Mesh[], projectionMatrix, viewportWidth, viewportHeight, CONTEXT)

    requestAnimationFrame(update)
}

requestAnimationFrame(update)
