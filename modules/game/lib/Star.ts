import * as Pixi from 'pixi.js'
import Collection from '../../utils/lib/Collection'
import BuildingType from '../data/BuildingType'
import { BuildingData, GeneralBuildingData, StarData } from '../types'
import Building from './buildings/Building'
import CrystalStore from './buildings/CrystalStore'
import MetalStore from './buildings/MetalStore'
import GameObject from './GameObject'
import { getBuildingClass } from './GameObjectFactory'
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

    public readonly buildings = new Collection<Building, BuildingType>({ idAccessor: building => building.name, items: [] })

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

        this._maxPopulation = this.size
        this._population = options.population
        this._farmers = options.farmers
        this._workers = options.workers
        this._scientists = options.scientists

        for (const building of options.buildings) this.build(building.name, building.level)
    } 

    public static createData({ events, onUpdate, owner, position }: Pick<GameObject, 'onUpdate' | 'events' | 'owner' | 'position'>) { // TODO: Move to factory.
        const options = { events, onUpdate, owner, position, id: 'TODO', level: 1 }

        return {
            farmers: 0,
            workers: 0,
            scientists: 0,
            population: 8,
            owner: null,
            buildings: [
                new MetalStore(options),
                new CrystalStore(options)
            ]
        }
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

    public renderPreview(turn: Turn): string {
        return 'stars/sol.png'
    }

    public get owner() {
        return this._owner
    }

    public set owner(owner: Player | null) {
        this.owner?.stars.remove(this.id)
        owner?.stars.add(this)
        this._owner = owner
        this.onUpdate()
    }

    public get maxPopulation(): number {
        return this._maxPopulation
    }
 
    public get population(): number {
        return this._population
    }

    public set population(value: number) {
        this._population = value
        this.onUpdate()
    }

    public get farmers(): number {
        return this._farmers
    }

    public set farmers(value: number) {
        this._farmers = value
        this.onUpdate()
    }

    public get workers(): number {
        return this._workers
    }

    public set workers(value: number) {
        this._workers = value
        this.onUpdate()
    }

    public get scientists(): number {
        return this._scientists
    }

    public set scientists(value: number) {
        this._scientists = value
        this.onUpdate()
    }

    public build(type: BuildingType, level?: number) {
        const building = this.buildings.get(type)

        if (!building) {
            const Building = getBuildingClass(type)
            this.buildings.add(new Building({ events: this.events, level: 1, onUpdate: this.onUpdate, id: 'TODO', owner: this.owner, position: this.position }))
        } else {
            building.level = level ?? (building.level + 1)
        }
    }

}

export default Star