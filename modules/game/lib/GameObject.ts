import * as Pixi from 'pixi.js'
import { Graphics } from 'pixi.js'

import { GameObjectData, Point } from '../types'
import { pcToPx } from './Converter'
import Player from './Player'

abstract class GameObject {

    public static readonly DEFAULT_VISIBILITY = 1

    protected _id: string
    protected _name: string
    protected _position: Point
    protected _owner: Player | null
    protected _visibility: number = GameObject.DEFAULT_VISIBILITY

    protected graphics: Pixi.Graphics
    protected miniGraphics: Pixi.Graphics
    protected label: Pixi.Text
    protected visibilityArea: Pixi.Graphics
    protected miniVisibilityArea: Pixi.Graphics

    public constructor(options: GameObjectData) {
        this._id = options.id
        this._name = options.name
        this._position = options.position
        this._owner = options.owner || null

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

    public abstract render(): Pixi.DisplayObject

    public abstract renderMini(): Pixi.DisplayObject

    public renderLabel(): Pixi.Text {
        this.label.x = pcToPx(this._position.x)
        this.label.style = { fill: 0xaaaaaa, align: 'center', fontFamily: 'Arial', fontSize: 14 }
        this.label.y = pcToPx(this._position.y) + 50
        this.label.anchor.set(0.5, 0.5)
        return this.label
    }

    public renderVisibility() {
        this.visibilityArea = new Pixi.Graphics()
        this.visibilityArea.beginFill(0xFFFFFF)
        this.visibilityArea.drawCircle(pcToPx(this.position.x), pcToPx(this.position.y), pcToPx(this.visibility))
        this.visibilityArea.endFill()
        return this.visibilityArea
    }

    public renderMiniVisibility() {
        this.miniVisibilityArea = new Pixi.Graphics()
        this.miniVisibilityArea.beginFill(0xFFFFFF)
        this.miniVisibilityArea.drawCircle(pcToPx(this.position.x), pcToPx(this.position.y), pcToPx(this.visibility))
        this.miniVisibilityArea.endFill()
        return this.miniVisibilityArea
    }

}

export default GameObject