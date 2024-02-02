import { Scene } from "../scene/Scene";
import { Rasterizer } from "../../modules/Rasterizer";

export class Softy {
    _scene?: Scene
    _prevTime: number
    _context: CanvasRenderingContext2D

    constructor(context: CanvasRenderingContext2D) {
        this._prevTime = 0
        this._context = context
        this._update = this._update.bind(this)
    }

    public set scene(value: Scene | undefined) {
        this._scene = value
    }

    public get scene() {
        return this._scene
    }

    public init() {
        if (!this._scene) throw new Error('Scene is not set')

        requestAnimationFrame(this._update)
    }

    private _update(time: number) {
        const deltaTime = time - this._prevTime
        this._prevTime = time
        //FIXME: добавить как дебаг функцию
        // console.log(`FPS: ${(1000 / deltaTime).toFixed(0)}`)
        Rasterizer.rasterize(this.scene as Scene, this._context)
        this.scene?.gameObjects
            .forEach(gameObject => gameObject.onUpdate(this.scene as Scene, deltaTime))

        requestAnimationFrame(this._update)
    }
}
