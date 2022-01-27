import { DisplayObject } from 'pixi.js'
import { ShipData } from '../../types'
import GameObject from '../GameObject'
import Turn from '../Turn'

class Ship extends GameObject {

    public constructor(options: ShipData<true>) {
        super(options)
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

export default Ship