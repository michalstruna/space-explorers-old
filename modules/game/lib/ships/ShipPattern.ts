import { DisplayObject } from 'pixi.js'
import Collection from '../../../utils/lib/Collection'
import { ShipPatternData } from '../../types'
import GameObject from '../GameObject'
import Turn from '../Turn'
import ShipComponent from '../shipComponents/ShipComponent'

class ShipPattern extends GameObject {

    public readonly components = new Collection<ShipComponent>()

    public constructor(options: ShipPatternData<true>) {
        super(options)
        // TODO: Add components.
    }

    public render(turn: Turn): DisplayObject {
        throw new Error('Method not implemented.')
    }

    public renderMini(turn: Turn): DisplayObject {
        throw new Error('Method not implemented.')
    }

    public renderPreview(turn: Turn): string {
        throw new Error('Method not implemented.')
    }

}

export default ShipPattern