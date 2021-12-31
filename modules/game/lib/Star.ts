import * as Pixi from 'pixi.js'

import { StarData } from '../types'
import Game from './Game'

type StarRenderData = StarData & {
    container: Pixi.Container
    labelContainer: Pixi.Container
}

const colorMap: Record<string, number> = {
    O: 0x059EFF,
    B: 0xCDD0FF,
    A: 0xF6F3FF,
    F: 0xFAFCFF,
    G: 0xF8FFA4,
    K: 0XFFBA95,
    M: 0xFF7E5F
}

const sizeMap: Record<string, number> = {
    0: 24,
    I: 24,
    II: 16,
    III: 16,
    IV: 8,
    V: 8
}

class Star {

    private id: number
    private name: string
    private size: string
    private spect: string
    private pos: Pixi.Point

    private color: number
    private width: number

    private container: Pixi.Container
    private labelContainer: Pixi.Container
    private g: Pixi.Graphics
    private label: Pixi.Text
    
    public constructor(options: StarRenderData) {
        this.id = options.id
        this.name = options.name
        this.size = options.size
        this.spect = options.spect
        this.pos = new Pixi.Point(options.x, options.y)
        this.color = colorMap[this.spect[0]]
        this.width = sizeMap[this.size]

        this.container = options.container
        this.labelContainer = options.labelContainer

        this.g = new Pixi.Graphics()
        this.label = new Pixi.Text(this.name)

        this.render()
    }

    private render() {
        this.g.beginFill(this.color)
        this.g.drawCircle(Game.toPx(this.pos.x), Game.toPx(this.pos.y), this.width)
        this.g.endFill()
        this.container.addChild(this.g)

        this.label.x = Game.toPx(this.pos.x)
        this.label.style = { fill: 0xaaaaaa, align: 'center', fontFamily: 'Arial', fontSize: 14 }
        this.label.y = Game.toPx(this.pos.y) + this.width * 3
        this.label.anchor.set(0.5, 0.5)
        this.labelContainer.addChild(this.label)
    }

}

export default Star