import { DisplayObject } from 'pixi.js'

import BuildingType from '../../data/BuildingType'
import { GeneralBuildingData } from '../../types'
import Turn from '../Turn'
import Building from './Building'

class CrystalStore extends Building {

    public constructor(options: GeneralBuildingData<true>) {
        super({ ...options, name: BuildingType.CRYSTAL_STORE })
    }

    public render(turn: Turn): DisplayObject {
        throw new Error('Method not implemented.')
    }

    public renderMini(turn: Turn): DisplayObject {
        throw new Error('Method not implemented.')
    }

    public renderPreview(turn: Turn): string {
        return '/buildings/crystalMine.jpg'
    }

}

export default CrystalStore