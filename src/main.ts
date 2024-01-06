import { createProjectionMatrix, multiplyVectorByScalar } from './common/scripts'
import { Rasterizer } from './modules/Rasterizer'
import { ObjLoader } from './modules/ObjLoader'
import { Vector3D } from './common/Vector3D'
import { GameObject } from './components/gameObject/GameObject'
import { PerspectiveCamera } from './components/camera/PerspectiveCamera'

const CANVAS = document.getElementById('canvas') as HTMLCanvasElement
const CONTEXT = CANVAS.getContext('2d')

const camera = new PerspectiveCamera({
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

window.addEventListener('keypress', (event) => {
    const {
        forward,
        right,
        // position,
        up
    } = camera.localAxis
    switch (event.code) {
    case 'KeyW': {
        const vForward = multiplyVectorByScalar(forward, 0.1)
        camera.position = camera.position.add(vForward)
        break
    }
    case 'KeyS': {
        const vForward = multiplyVectorByScalar(forward, 0.1)
        camera.position = camera.position.subtract(vForward)
        break
    }
    case 'KeyA': {
        const vRight = multiplyVectorByScalar(right, -0.1)
        camera.position = camera.position.subtract(vRight)
        break
    }
    case 'KeyD': {
        const vRight = multiplyVectorByScalar(right, -0.1)
        camera.position = camera.position.add(vRight)
        break
    }
    case 'KeyR': {
        const vUp = multiplyVectorByScalar(up, -0.1)
        camera.position = camera.position.subtract(vUp)
        break
    }
    case 'KeyF': {
        const vUp = multiplyVectorByScalar(up, -0.1)
        camera.position = camera.position.add(vUp)
        break
    }
    case 'KeyQ': {
        camera.rotation =
                new Vector3D(
                    camera.rotation.x,
                    camera.rotation.y + 0.1,
                    camera.rotation.z
                )
        break
    }
    case 'KeyE': {
        camera.rotation =
                new Vector3D(
                    camera.rotation.x,
                    camera.rotation.y - 0.1,
                    camera.rotation.z
                )
        break
    }
    default: break
    }
})

let prevTime = 0

const fpsCounter = document.getElementById('fps')

ObjLoader.loadFromUrl().then((meshes) => {
    const teapot = new GameObject({
        rotation: new Vector3D(0, 0, 0),
        position: new Vector3D(0, 0, 6),
    })

    meshes.forEach(mesh => teapot.addChild(mesh))

    const testData = [ teapot ]

    const update = (
        time: number
    ) => {
        //FIXME: добавить как дебаг функцию
        fpsCounter.textContent = `FPS: ${(1000 / (time - prevTime)).toFixed(0)}`
        prevTime = time

        // teapot.rotation.x += 0.01
        // teapot.rotation.y += 0.01

        Rasterizer.rasterize(testData, projectionMatrix, viewportWidth, viewportHeight, CONTEXT)

        requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
})

