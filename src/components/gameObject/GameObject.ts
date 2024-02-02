import { Transform } from '../transform/Transform'
import { ENTITY_TYPES, EntityType, GameObjectProps } from '../../common/types'
import { Entity } from '../entity/Entity'
import { Mesh } from '../../common/Mesh'
import { PerspectiveCamera } from '../camera/PerspectiveCamera'
import { Vector3D } from '../../common/Vector3D'
import { Scene } from '../scene/Scene'

export class GameObject extends Entity {
    readonly _transform: Transform
    private _parent?: GameObject
    //FIXME: возможно стоит хранить все энтити в одном списке, а не в объекте
    private _children: (Mesh | GameObject | PerspectiveCamera)[]

    constructor({ rotation, position }: GameObjectProps) {
        super()

        this._transform = new Transform({ rotation, position })
        this._parent = undefined
        this._children = []
        this._type = ENTITY_TYPES.GameObject
    }

    get children() {
        return this._children
    }

    get transform() {
        return this._transform
    }

    get position() {
        return this._transform.position
    }

    get rotation() {
        return this._transform.rotation
    }

    set position(value) {
        this._transform.position = value
    }

    set rotation(value) {
        this._transform.rotation = value
    }

    rotate(vector: Vector3D) {
        this._transform.rotation = this._transform.rotation.add(vector)
    }

    public getMeshes(): Mesh[] {
        return this._children.filter((child) => {
            return child.type === ENTITY_TYPES.Mesh
        }) as Mesh[]
    }

    public setParent(parent: GameObject) {
        this._parent = parent
    }

    public removeParent() {
        this._parent = undefined
    }

    public addChild(value: Mesh | GameObject | PerspectiveCamera) {
        this._children = [ ...this.children, value ]
    }

    public removeChild(id: string) {
        this._children = this.children.filter((child) => {
            return child.id !== id
        })
    }

    public onUpdate(scene: Scene, deltaTime: number) {}
}
