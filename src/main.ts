import { ObjLoader } from './modules/ObjLoader'
import { Vector3D } from './common/Vector3D'
import { GameObject } from './components/gameObject/GameObject'
import { Softy } from './components/softy/Softy'
import { Scene } from './components/scene/Scene'
import { FirstPersonController } from './modules/FirstPersonController'

const CANVAS = document.getElementById('canvas') as HTMLCanvasElement
const CONTEXT = CANVAS.getContext('2d') as CanvasRenderingContext2D

const scene = new Scene()
const engine = new Softy(CONTEXT)

ObjLoader.loadFromUrl().then((meshes) => {
    const testObject = new GameObject({
        rotation: new Vector3D(0, 0, 0),
        position: new Vector3D(0, 0, 6),
    })

    const fpsController = new FirstPersonController({
        rotation: new Vector3D(0, 0, 0),
        position: new Vector3D(0, 0, 0)
    })

    meshes.forEach(mesh => testObject.addChild(mesh))

    scene.addGameObject(testObject)
    scene.addGameObject(fpsController)

    engine.scene = scene
    engine.init()
})
