import { ObjLoader } from './modules/ObjLoader'
import {
    Scene,
    GameObject,
    Engine,
    Vector3,
    PerspectiveCamera
} from 'softy-engine'

const CANVAS = document.getElementById('canvas') as HTMLCanvasElement

// const camera = new PerspectiveCamera({
//     position: new Vector3D(0, 0, 0),
//     rotation: new Vector3D(0, 0, 0)
// })
// const {
//     viewportAspectRatio,
//     fovRadians,
//     zFar,
//     zNear,
//     viewportWidth,
//     viewportHeight
// } = camera
// const projectionMatrix = createProjectionMatrix(viewportAspectRatio, fovRadians, zFar, zNear)
// let prevTime = 0
const fpsCounter = document.getElementById('fps') as HTMLDivElement
// const listener = (evt: MouseEvent) => {
//     camera.rotation = new Vector3D(
//         camera.rotation.x - evt.movementY / 800,
//         camera.rotation.y - evt.movementX / 800,
//         camera.rotation.z
//     )
// }
// let isMouseCaptured = false
// window.addEventListener('keypress', (evt) => {
//     if (evt.code === 'Space') {
//         if (isMouseCaptured) {
//             window.removeEventListener('mousemove', listener)
//             isMouseCaptured = false
//         } else {
//             window.addEventListener('mousemove', listener)
//             isMouseCaptured = true
//         }
//     }
// })
// ObjLoader.loadFromUrl().then((meshes) => {
//     const teapot = new GameObject({
//         rotation: new Vector3D(0, 0, 0),
//         position: new Vector3D(0, 0, 6),
//     })

//     meshes.forEach(mesh => teapot.addChild(mesh))

//     const testData = [ teapot ]

//     const Input = new KeyboardInputManager()

//     const Rasterizer = new WasmRasterizer()

//     Rasterizer.init().then(() => {
//         const update = (
//             time: number
//         ) => {
//             const dt = time - prevTime
    
//             //FIXME: добавить как дебаг функцию
//             fpsCounter.textContent = `FPS: ${(1000 / (dt)).toFixed(0)}`
    
//             const {
//                 forward,
//                 right,
//                 // position,
//                 // up
//             } = camera.localAxis
    
//             let cameraDisplacement = new Vector3D(0, 0, 0)
    
//             if (Input.isActive('MoveRight')) {
//                 const vRight = multiplyVectorByScalar(right, -2 * (dt / 1000))
//                 cameraDisplacement = cameraDisplacement.add(vRight)
//             }
    
//             if (Input.isActive('MoveLeft')) {
//                 const vRight = multiplyVectorByScalar(right, -2 * (dt / 1000))
//                 cameraDisplacement = cameraDisplacement.subtract(vRight)
//             }
    
//             if (Input.isActive('MoveForward')) {
//                 const vForward = multiplyVectorByScalar(forward, 2 * (dt / 1000))
//                 cameraDisplacement = cameraDisplacement.add(vForward)
//             }
    
//             if (Input.isActive('MoveBack')) {
//                 const vForward = multiplyVectorByScalar(forward, 2 * (dt / 1000))
//                 cameraDisplacement = cameraDisplacement.subtract(vForward)
//             }
    
//             if (cameraDisplacement.x !== 0 || cameraDisplacement.y !== 0 || cameraDisplacement.z !== 0) {
//                 camera.position = camera.position.add(cameraDisplacement)
//             }
    
//             Rasterizer.rasterize(testData, projectionMatrix, viewportWidth, viewportHeight, CONTEXT, camera)
    
//             prevTime = time
    
//             // requestAnimationFrame(update)
//         }
    
//         // requestAnimationFrame(update)
//         update(1)
//     })
// })

ObjLoader.loadFromUrl().then((meshes) => {
    const engine = Engine.new(CANVAS)
    const camera = PerspectiveCamera.new(Vector3.new(0, 0, 0), Vector3.new(0, 0, 0))
    const scene = Scene.new()
    const testObject = GameObject.new(Vector3.new(0, 0, 6), Vector3.new(0, 0, 0))
    
    scene.add_objects([testObject])
    scene.add_meshes(meshes.filter(item => item))
    scene.set_camera(camera)

    engine.set_scene(scene)

    let prevTime = 0

    const update = (
        time: number
    ) => {
        const dt = time - prevTime

        //FIXME: добавить как дебаг функцию
        fpsCounter.textContent = `FPS: ${(1000 / (dt)).toFixed(0)}`

        const arr = engine.update(time)

        console.log(arr.every(item => item === 0))

        prevTime = time

        // requestAnimationFrame(update)
    }

    // requestAnimationFrame(update)
    update(1) 
  
    // Rasterizer.init().then(() => {
    //     const update = (
    //         time: number
    //     ) => {
    //         const dt = time - prevTime
    
    //         //FIXME: добавить как дебаг функцию
    //         fpsCounter.textContent = `FPS: ${(1000 / (dt)).toFixed(0)}`

    //         Rasterizer.rasterize(testData, projectionMatrix, viewportWidth, viewportHeight, CONTEXT, camera)
    
    //         prevTime = time
    
    //         // requestAnimationFrame(update)
    //     }
    
    //     // requestAnimationFrame(update)
    //     update(1)
    // })
})
