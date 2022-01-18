import * as Pixi from 'pixi.js'
import { StarData } from '../types'
import { pcToPx } from './Converter'
import GameObject from './GameObject'
import Player from './Player'

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

class Star extends GameObject {

    private harvard: string
    private yerkes: string
    private size: number
    private color: number

    public constructor(options: StarData<true>) {
        super(options)
        this.yerkes = options.yerkes
        this.harvard = options.harvard
        this.color = colorMap[this.harvard[0]]
        this.size = sizeMap[this.yerkes]
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

    public get owner() {
        return this._owner
    }

    public set owner(owner: Player | null) {
        this.owner?.stars.remove(this.id)
        owner?.stars.add(this)
        this._owner = owner
    }

}

export default Star