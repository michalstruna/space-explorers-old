import BuildingType from '../../data/BuildingType'
import { BuildingData } from '../../types'
import InnerGameObject from '../InnerGameObject'
import MetalStore from './MetalStore'


abstract class Building extends InnerGameObject {

    private _level: number

    public static getByType(type: BuildingType) {
        switch (type) {
            case BuildingType.METAL_STORE: return MetalStore
        }
    }

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

    
}

export default Building