import { PlayerData } from '../types'
import Collection from '../../native/lib/Collection'
import Star from './Star'

class Player {

    private _id: string
    private _name: string
    private _color: number
    private _stars = new Collection<Star>()

    public constructor(options: PlayerData) {
        this._id = options.id
        this._name = options.name
        this._color = options.color
    }

    public get id() {
        return this._id
    }

    public get name() {
        return this._name
    }

    public get color() {
        return this._color
    }

    public get stars() {
        return this._stars
    }

}

export default Player