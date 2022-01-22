import BuildingType from '../../data/BuildingType'
import { BuildingData } from '../../types'
import GameObject from '../GameObject'
import Turn from '../Turn'

abstract class Building extends GameObject {

    private _level: number

    public constructor(options: BuildingData<true>) {
        super(options)
        this._level = options.level
    }

    public get name() {
        return this._name as BuildingType
    }

    public get level(): number {
        return this._level
    }

    public set level(value: number) {
        this._level = value
    }

    public renderPreview(turn: Turn): string {
        return 'buildings/metalStore.png'
    }

    
}

export default Building