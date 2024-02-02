import { PerspectiveCamera } from "../camera/PerspectiveCamera";
import { GameObject } from "../gameObject/GameObject";
import { Vector3D } from "../../common/Vector3D";

export class Scene {
    private _camera: PerspectiveCamera
    private _gameObjects: GameObject[]

    constructor() {
        this._camera = new PerspectiveCamera({
            position: new Vector3D(0, 0, 0),
            rotation: new Vector3D(0, 0, 0)
        })
        this._gameObjects = []
    }

    public get camera(): PerspectiveCamera {
        return this._camera
    }

    public set camera(value: PerspectiveCamera) {
        this._camera = value
    }

    public get gameObjects() {
        return this._gameObjects
    }

    public addGameObject(object: GameObject) {
        this._gameObjects = [...this._gameObjects, object]
    }

    public removeGameObject(id: string) {
        this._gameObjects = this._gameObjects.filter(object => {
            return object._id !== id
        })
    }
}
