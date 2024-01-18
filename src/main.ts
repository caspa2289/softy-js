import { ObjLoader } from './modules/ObjLoader'
import {
    Scene,
    GameObject,
    Engine,
    Vector3,
    PerspectiveCamera
} from 'softy-engine'

const CANVAS = document.getElementById('canvas') as HTMLCanvasElement

const fpsCounter = document.getElementById('fps') as HTMLDivElement

ObjLoader.loadFromUrl().then((meshes) => {
    const engine = Engine.new(CANVAS)
    const camera = PerspectiveCamera.new(Vector3.new(0, 0, 0), Vector3.new(0, 0, 0))
    const scene = Scene.new()
    const testObject = GameObject.new(Vector3.new(0, 0, 6), Vector3.new(0, 0, 0))
    
    const filteredMeshes = meshes.filter(item => item)

    testObject.add_child(String(filteredMeshes[0].get_id()))
    scene.add_objects([ testObject ])
    scene.add_meshes(filteredMeshes)
    scene.set_camera(camera)
    engine.set_scene(scene)

    let prevTime = 0

    const update = (
        time: number
    ) => {
        const dt = time - prevTime

        fpsCounter.textContent = `FPS: ${(1000 / (dt)).toFixed(0)}`

        engine.update(time)

        prevTime = time

        requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
})
