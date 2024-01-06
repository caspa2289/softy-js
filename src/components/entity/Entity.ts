import { ENTITY_TYPES, EntityType } from '../../common/types'

export class Entity {
    readonly _id: string
    readonly _type: EntityType

    constructor() {
        this._id = String(Math.random()) //FIXME: add guid generation
        this._type = ENTITY_TYPES.Entity
    }

    get id() {
        return this._id
    }

    get type() {
        return this._type
    }
}
