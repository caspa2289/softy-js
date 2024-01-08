import { createProjectionMatrix, multiplyVectorByScalar } from './common/scripts'
import { Rasterizer } from './modules/Rasterizer'
import { ObjLoader } from './modules/ObjLoader'
import { Vector3D } from './common/Vector3D'
import { GameObject } from './components/gameObject/GameObject'
import { PerspectiveCamera } from './components/camera/PerspectiveCamera'
import { KeyboardInputManager } from './components/input/KeyboardInputManager'

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

// case 'KeyR': {
//     const vUp = multiplyVectorByScalar(up, -0.1)
//     camera.position = camera.position.subtract(vUp)
//     break
// }
// case 'KeyF': {
//     const vUp = multiplyVectorByScalar(up, -0.1)
//     camera.position = camera.position.add(vUp)
//     break
// }
// case 'KeyQ': {
//     camera.rotation =
//             new Vector3D(
//                 camera.rotation.x,
//                 camera.rotation.y + 0.1,
//                 camera.rotation.z
//             )
//     break
// }
// case 'KeyE': {
//     camera.rotation =
//             new Vector3D(
//                 camera.rotation.x,
//                 camera.rotation.y - 0.1,
//                 camera.rotation.z
//             )
//     break
// }

let prevTime = 0

const fpsCounter = document.getElementById('fps')

const listener = (evt: MouseEvent) => {
    camera.rotation = new Vector3D(
        camera.rotation.x - evt.movementY / 800,
        camera.rotation.y - evt.movementX / 800,
        camera.rotation.z
    )
}

let isMouseCaptured = false

window.addEventListener('keypress', (evt) => {
    if (evt.code === 'Space') {
        if (isMouseCaptured) {
            window.removeEventListener('mousemove', listener)
            isMouseCaptured = false
        } else {
            window.addEventListener('mousemove', listener)
            isMouseCaptured = true
        }
    }
})



ObjLoader.loadFromUrl().then((meshes) => {
    const teapot = new GameObject({
        rotation: new Vector3D(0, 0, 0),
        position: new Vector3D(0, 0, 6),
    })

    meshes.forEach(mesh => teapot.addChild(mesh))

    const testData = [ teapot ]

    const Input = new KeyboardInputManager()

    const update = (
        time: number
    ) => {
        const dt = time - prevTime

        //FIXME: добавить как дебаг функцию
        fpsCounter.textContent = `FPS: ${(1000 / (dt)).toFixed(0)}`

        const {
            forward,
            right,
            // position,
            // up
        } = camera.localAxis

        let cameraDisplacement = new Vector3D(0, 0, 0)

        if (Input.isActive('MoveRight')) {
            const vRight = multiplyVectorByScalar(right, -2 * (dt / 1000))
            cameraDisplacement = cameraDisplacement.add(vRight)
        }

        if (Input.isActive('MoveLeft')) {
            const vRight = multiplyVectorByScalar(right, -2 * (dt / 1000))
            cameraDisplacement = cameraDisplacement.subtract(vRight)
        }

        if (Input.isActive('MoveForward')) {
            const vForward = multiplyVectorByScalar(forward, 2 * (dt / 1000))
            cameraDisplacement = cameraDisplacement.add(vForward)
        }

        if (Input.isActive('MoveBack')) {
            const vForward = multiplyVectorByScalar(forward, 2 * (dt / 1000))
            cameraDisplacement = cameraDisplacement.subtract(vForward)
        }

        if (cameraDisplacement.x !== 0 || cameraDisplacement.y !== 0 || cameraDisplacement.z !== 0) {
            camera.position = camera.position.add(cameraDisplacement)
        }

        Rasterizer.rasterize(testData, projectionMatrix, viewportWidth, viewportHeight, CONTEXT)

        prevTime = time

        requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
})
