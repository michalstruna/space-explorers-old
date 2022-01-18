import * as Pixi from 'pixi.js'
import { StarData } from '../types'
import { pcToPx } from './Converter'
import GameObject from './GameObject'
import Player from './Player'
import Turn from './Turn'

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

    private _maxPopulation: number
    private _population: number
    private _farmers: number
    private _workers: number
    private _scientists: number

    public constructor(options: StarData<true>) {
        super(options)
        this.yerkes = options.yerkes
        this.harvard = options.harvard
        this.color = colorMap[this.harvard[0]]
        this.size = sizeMap[this.yerkes]

        this._maxPopulation = this.size // TODO: Calculate.
        this._population = options.population
        this._farmers = options.farmers
        this._workers = options.workers
        this._scientists = options.scientists
    } 

    public render(): Pixi.DisplayObject {
        const pos = this.pxPosition
        const size = this.size * 5

        this.hitArea.x = pos.x - size
        this.hitArea.y = pos.y + Math.floor(this.size / 5) - size
        this.hitArea.height = this.hitArea.width = size * 2
        

        this.graphics.beginFill(this.color)
        this.graphics.drawCircle(this.pxPosition.x, this.pxPosition.y, this.size * 1.5)
        this.graphics.endFill()
        return this.graphics
    }

    public renderMini(): Pixi.DisplayObject {
        this.miniGraphics.beginFill(this.color)
        this.miniGraphics.drawCircle(this.pxPosition.x, this.pxPosition.y, this.size * 5)
        this.miniGraphics.endFill()
        return this.miniGraphics
    }

    public renderLabel(turn: Turn) {
        const label = super.renderLabel(turn)
        label.y = this.pxPosition.y + this.size * 4
        // TODO: super(this.size * constant) - radius of GameObject + hitArea in parent?
        return label
    }

    public get owner() {
        return this._owner
    }

    public set owner(owner: Player | null) {
        this.owner?.stars.remove(this.id)
        owner?.stars.add(this)
        this._owner = owner
        this.handleUpdate()
    }

    public get maxPopulation(): number {
        return this._maxPopulation
    }
 
    public get population(): number {
        return this._population
    }

    public set population(value: number) {
        this._population = value
        this.handleUpdate()
    }

    public get farmers(): number {
        return this._farmers
    }

    public set farmers(value: number) {
        this._farmers = value
        this.handleUpdate()
    }

    public get workers(): number {
        return this._workers
    }

    public set workers(value: number) {
        this._workers = value
        this.handleUpdate()
    }

    public get scientists(): number {
        return this._scientists
    }

    public set scientists(value: number) {
        this._scientists = value
        this.handleUpdate()
    }

}

export default Star