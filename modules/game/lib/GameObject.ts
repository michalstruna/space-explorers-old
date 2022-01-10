import * as Pixi from 'pixi.js'
import { Graphics } from 'pixi.js'

import { GameObjectData, Point } from '../types'
import { pcToPx } from './Converter'
import EventManager from './EventManager'
import Player from './Player'
import Turn from './Turn'

abstract class GameObject {

    public static readonly DEFAULT_VISIBILITY = 1

    protected _id: string
    protected _name: string
    protected _position: Point
    protected _owner: Player | null
    protected _visibility: number = GameObject.DEFAULT_VISIBILITY
    protected events: EventManager

    protected graphics: Pixi.Graphics
    protected miniGraphics: Pixi.Graphics
    protected label: Pixi.Text
    protected visibilityArea: Pixi.Graphics
    protected miniVisibilityArea: Pixi.Graphics

    public constructor(options: GameObjectData<true>) {
        this._id = options.id
        this._name = options.name
        this._position = options.position
        this._owner = options.owner || null
        this.events = options.events

        this.graphics = new Pixi.Graphics()
        this.miniGraphics = new Pixi.Graphics()
        this.label = new Pixi.Text(this.name)
        this.visibilityArea = new Graphics()
        this.miniVisibilityArea = new Graphics()
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
        this.label.x = pcToPx(this._position.x)
        this.label.style = { fill: this.owner?.color ?? 0xaaaaaa, align: 'center', fontFamily: 'Arial', fontSize: 14, dropShadow: true, dropShadowDistance: 0, dropShadowBlur: 3 }
        this.label.y = pcToPx(this._position.y) + 50
        this.label.anchor.set(0.5, 0.5)
        return this.label
    }

    public renderVisibility(turn: Turn) {
        this.visibilityArea = this.visibilityArea || new Pixi.Graphics()
        this.visibilityArea.clear()

        if (turn.player.id !== this.owner?.id) return this.visibilityArea

        this.visibilityArea.beginFill(0xFFFFFF)
        this.visibilityArea.drawCircle(pcToPx(this.position.x), pcToPx(this.position.y), pcToPx(this.visibility))
        this.visibilityArea.endFill()


        return this.visibilityArea
    }

    public renderMiniVisibility(turn: Turn) {
        this.miniVisibilityArea = this.miniVisibilityArea || new Pixi.Graphics()
        this.miniVisibilityArea.clear()
        if (turn.player.id !== this.owner?.id) return this.miniVisibilityArea

        this.miniVisibilityArea.beginFill(0xFFFFFF)
        this.miniVisibilityArea.drawCircle(pcToPx(this.position.x), pcToPx(this.position.y), pcToPx(this.visibility))
        this.miniVisibilityArea.endFill()
        return this.miniVisibilityArea
    }

}

export default GameObject