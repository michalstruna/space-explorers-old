import { DisplayObject } from 'pixi.js'
import { ShipComponentData } from '../../types'
import GameObject from '../GameObject'
import Turn from '../Turn'

class ShipComponent extends GameObject {

    public constructor(options: ShipComponentData<true>) {
        super(options)
            // TODO: Properties
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

export default ShipComponent