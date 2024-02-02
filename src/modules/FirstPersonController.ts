import { GameObject } from "../components/gameObject/GameObject";
import { KeyboardInputManager } from "../components/input/KeyboardInputManager";
import { GameObjectProps } from "../common/types";
import { Vector3D } from "../common/Vector3D";
import { multiplyVectorByScalar } from "../common/scripts";
import { Scene } from "../components/scene/Scene";

export type FirstPersonControllerProps = GameObjectProps & {
    input?: KeyboardInputManager
}

// const listener = (evt: MouseEvent) => {
//     scene.camera.rotate(
//         new Vector3D(-evt.movementY / 800, -evt.movementX / 800, 0)
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

//FIXME: сделать настраиваемой
const SPEED = 2

export class FirstPersonController extends GameObject {
    _input: KeyboardInputManager

    constructor({ rotation, position, input }: FirstPersonControllerProps) {
        super({ rotation, position })

        this._input = input ?? new KeyboardInputManager()
    }

    private _onUpdate({ camera } : Scene, dt: number) {        
        const {
            forward,
            right,
            // position,
            // up
        } = camera.localAxis

        let cameraDisplacement = new Vector3D(0, 0, 0)

        if (this._input.isActive('MoveRight')) {
            const vRight = multiplyVectorByScalar(right, -SPEED * (dt / 1000))
            cameraDisplacement = cameraDisplacement.add(vRight)
        }

        if (this._input.isActive('MoveLeft')) {
            const vRight = multiplyVectorByScalar(right, -SPEED * (dt / 1000))
            cameraDisplacement = cameraDisplacement.subtract(vRight)
        }

        if (this._input.isActive('MoveForward')) {
            const vForward = multiplyVectorByScalar(forward, SPEED * (dt / 1000))
            cameraDisplacement = cameraDisplacement.add(vForward)
        }

        if (this._input.isActive('MoveBack')) {
            const vForward = multiplyVectorByScalar(forward, SPEED * (dt / 1000))
            cameraDisplacement = cameraDisplacement.subtract(vForward)
        }

        if (cameraDisplacement.x !== 0 || cameraDisplacement.y !== 0 || cameraDisplacement.z !== 0) {
            camera.position = camera.position.add(cameraDisplacement)
        }
    }

    public onUpdate(scene: Scene, deltaTime: number): void {
        this._onUpdate(scene, deltaTime)
    }
}
