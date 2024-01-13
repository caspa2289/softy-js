import { Transform } from '../transform/Transform'
import { ENTITY_TYPES, EntityType, GameObjectProps } from '../../common/types'
import { Entity } from '../entity/Entity'

export class GameObject extends Entity {
    readonly _transform: Transform
    private _parent?: GameObject
    //FIXME: возможно стоит хранить все энтити в одном списке, а не в объекте
    private _children: Entity[]

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

    public getChildrenByType<T extends Entity>(type: EntityType): T[] {
        return this._children.filter((child) => {
            return child.type === type
        })
    }

    public setParent(parent: GameObject) {
        this._parent = parent
    }

    public removeParent() {
        this._parent = undefined
    }

    public addChild(value: Entity) {
        this._children = [ ...this.children, value ]
    }

    public removeChild(id: string) {
        this._children = this.children.filter((child) => {
            return child.id !== id
        })
    }
}
