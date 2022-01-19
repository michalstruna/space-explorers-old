import { InnerGameObjectData } from '../types'
import GameObject from './GameObject'

abstract class InnerGameObject extends GameObject {

    private _parent: GameObject

    public constructor(options: InnerGameObjectData<true>) {
        super({ ...options, owner: options.parent?.owner, position: { x: 0, y: 0 } })
        this._parent = options.parent
    }

    public set parent(value: GameObject) {
        this._parent = value
        this.owner = value?.owner
        this.position = value?.position
    }

    public get parent() {
        return this._parent
    }

}

export default InnerGameObject