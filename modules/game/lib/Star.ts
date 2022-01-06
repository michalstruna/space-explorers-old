import * as Pixi from 'pixi.js'
import { Point, Renderable, StarData } from '../types'
import { pcToPx } from './Converter'

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

class Star implements Renderable {

    private id: number
    private name: string
    private harvard: string
    private yerkes: string
    private _position: Point

    private size: number
    private color: number

    private graphics: Pixi.Graphics
    private miniGraphics: Pixi.Graphics
    private label: Pixi.Text

    public constructor(options: StarData) {
        this.id = options.id
        this.name = options.name
        this.yerkes = options.yerkes
        this.harvard = options.harvard
        this._position = options.position

        this.color = colorMap[this.harvard[0]]
        this.size = sizeMap[this.yerkes]

        this.graphics = new Pixi.Graphics()
        this.miniGraphics = new Pixi.Graphics()
        this.label = new Pixi.Text(this.name)
    } 

    public render(): Pixi.DisplayObject {
        this.graphics.beginFill(this.color)
        this.graphics.drawCircle(pcToPx(this._position.x), pcToPx(this._position.y), this.size)
        this.graphics.endFill()
        return this.graphics
    }

    public renderMini(): Pixi.DisplayObject {
        this.miniGraphics.beginFill(this.color)
        this.miniGraphics.drawCircle(pcToPx(this._position.x), pcToPx(this._position.y), this.size * 5)
        this.miniGraphics.endFill()
        return this.miniGraphics
    }

    public renderLabel(): Pixi.Text {
        this.label.x = pcToPx(this._position.x)
        this.label.style = { fill: 0xaaaaaa, align: 'center', fontFamily: 'Arial', fontSize: 14 }
        this.label.y = pcToPx(this._position.y) + this.size * 3
        this.label.anchor.set(0.5, 0.5)
        return this.label
    }

    public get visibility() {
        return pcToPx(1)
    }

    public get position() {
        return this._position
    }

}

export default Star