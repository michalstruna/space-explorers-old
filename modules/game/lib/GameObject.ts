import * as Pixi from 'pixi.js'
import { InteractionEvent } from 'pixi.js'

import { GameObjectData, Point } from '../types'
import { pcToPx } from './Converter'
import Player from './Player'
import Turn from './Turn'
import Events from './Events'

abstract class GameObject {

    public static readonly DEFAULT_VISIBILITY = 1

    public readonly id: string
    public readonly name: string
    protected _position: Point
    protected _owner: Player | null
    protected _visibility: number = GameObject.DEFAULT_VISIBILITY
    protected readonly events: Events
    protected readonly hitArea = new Pixi.Rectangle()
    protected readonly handleUpdate: () => void

    public readonly graphics: Pixi.Graphics
    public readonly miniGraphics: Pixi.Graphics
    public readonly label: Pixi.Text

    public constructor(options: GameObjectData<true>) {
        this.id = options.id
        this.name = options.name
        this._position = options.position
        this._owner = options.owner || null
        this.events = options.events
        this.handleUpdate = options.onUpdate

        this.graphics = new Pixi.Graphics()
        this.miniGraphics = new Pixi.Graphics()
        this.label = new Pixi.Text(this.name)

        this.graphics.hitArea = this.hitArea

        this.bindEvents()
    }

    public get position() {
        return this._position
    }

    public set position(position: Point) {
        this._position = position
        this.handleUpdate()
    }

    public get pxPosition() {
        return { x: pcToPx(this.position.x), y: pcToPx(this.position.y) }
    }

    public get owner() {
        return this._owner
    }

    public set owner(owner: Player | null) {
        this._owner = owner
        this.handleUpdate()
    }

    public get visibility() {
        return this._visibility
    }

    public set visibility(visibility: number) {
        this._visibility = visibility
        this.handleUpdate()
    }

    public abstract render(turn: Turn): Pixi.DisplayObject

    public abstract renderMini(turn: Turn): Pixi.DisplayObject

    public renderLabel(turn: Turn): Pixi.Text {
        const pxPosition = this.pxPosition

        this.label.x = pxPosition.x
        this.label.style = { fill: this.owner?.color ?? 0xaaaaaa, align: 'center', fontFamily: 'Arial', fontSize: 14, dropShadow: true, dropShadowDistance: 0, dropShadowBlur: 3 }
        this.label.y = pxPosition.y + 50
        this.label.anchor.set(0.5, 0.5)
        return this.label
    }

    public renderVisibility(mask: Pixi.Graphics, turn: Turn) {
        if (turn.player.id !== this.owner?.id) return mask

        const pxPosition = this.pxPosition
        mask.beginFill(0xFFFFFF)
        mask.drawCircle(pxPosition.x, pxPosition.y, pcToPx(this.visibility))
        mask.endFill()

        return mask
    }

    private handleClick = () => {
        this.events.emit('click', { object: this })
    }

    private bindEvents() {
        this.graphics.interactive = this.label.interactive = true
        this.graphics.on('click', this.handleClick)
        this.label.on('click', this.handleClick)
    }

}

export default GameObject