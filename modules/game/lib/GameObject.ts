import * as Pixi from 'pixi.js'
import EventEmitter from 'eventemitter3'

import { GameObjectData, Point } from '../types'
import { pcToPx } from './Converter'
import Player from './Player'
import Turn from './Turn'

abstract class GameObject {

    public static readonly DEFAULT_VISIBILITY = 1

    protected _id: string
    protected _name: string
    protected _position: Point
    protected _owner: Player | null
    protected _visibility: number = GameObject.DEFAULT_VISIBILITY
    protected events: EventEmitter

    protected graphics: Pixi.Graphics
    protected miniGraphics: Pixi.Graphics
    protected label: Pixi.Text

    public constructor(options: GameObjectData<true>) {
        this._id = options.id
        this._name = options.name
        this._position = options.position
        this._owner = options.owner || null
        this.events = options.events

        this.graphics = new Pixi.Graphics()
        this.miniGraphics = new Pixi.Graphics()
        this.label = new Pixi.Text(this.name)

        this.bindEvents()
    }

    public get id() {
        return this._id
    }

    public get name() {
        return this._name
    }

    public set name(name: string) {
        this._name = name
    }

    public get position() {
        return this._position
    }

    public set position(position: Point) {
        this._position = position
    }

    public get pxPosition() {
        return { x: pcToPx(this.position.x), y: pcToPx(this.position.y) }
    }

    public get owner() {
        return this._owner
    }

    public set owner(owner: Player | null) {
        this._owner = owner
    }

    public get visibility() {
        return this._visibility
    }

    public set visibility(visibility: number) {
        this._visibility = visibility
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

    private bindEvents() {
        this.graphics.interactive = this.label.interactive = true
        this.graphics.on('click', () => this.events.emit('click', { object: this }))
        this.label.on('click', () => this.events.emit('click', { object: this }))
    }

}

export default GameObject