import * as Pixi from 'pixi.js'

import { Viewport } from 'pixi-viewport'
import { Renderable } from '../types'

type MapUpdateHandler = () => void

type MapOptions = {
    screenSize: Pixi.Point | (() => Pixi.Point)
    worldSize: Pixi.Point
    container: Pixi.Container
    interaction: Pixi.InteractionManager

    project?: SpaceMap
    backgroundColor?: number
    onUpdate?: () => void
}

class SpaceMap {

    private _viewport: Viewport
    private screenSize: Pixi.Point | (() => Pixi.Point)
    private handleUpdate: MapUpdateHandler
    private project?: SpaceMap
    private visibilityMask = new Pixi.Graphics()

    private background = new Pixi.Sprite(Pixi.Texture.WHITE)
    private foreground = new Pixi.Container()
    private mainView = new Pixi.Container()
    private labelView = new Pixi.Container()
    private projection = new Pixi.Sprite(Pixi.Texture.WHITE)

    public constructor({
        screenSize,
        worldSize,
        container,
        interaction,
        project,
        backgroundColor,
        onUpdate = () => { }
    }: MapOptions) {
        const size = screenSize instanceof Pixi.Point ? screenSize : screenSize()
        this.screenSize = screenSize
        this.project = project

        this._viewport = new Viewport({
            screenWidth: size.x,
            screenHeight: size.y,
            worldWidth: worldSize.x,
            worldHeight: worldSize.y,
            noTicker: !!project,
            stopPropagation: true,
            interaction: interaction
        })

        if (backgroundColor !== undefined) {
            this.viewport.addChild(this.background)
            this.background.tint = backgroundColor
        }

        this.viewport.addChild(this.foreground)
        this.foreground.addChild(this.mainView)
        this.foreground.addChild(this.labelView)

        if (project) {
            this.viewport.scale.set(size.x / worldSize.x, size.y / worldSize.y)
            this.viewport.addChild(this.projection)
            this.projection.alpha = 0.25
            this.projection.tint = 0xFFFFFF
            this.viewport.on('clicked', this.handleProjectClick)
        } else {
            this._viewport = this.viewport.drag().pinch().wheel().decelerate().clamp({
                direction: 'all',
                underflow: 'center'
            }).clampZoom({
                maxWidth: worldSize.x,
                maxHeight: worldSize.y,
                minHeight: 200
            })
        }

        this.foreground.mask = this.visibilityMask

        const updater = project ? project : this
        updater.viewport.on('moved', this.update)
        updater.viewport.on('zoomed', this.update)
        window.addEventListener('resize', this.update)

        this.handleUpdate = onUpdate
        container.addChild(this.viewport)
        this.update()
        this.viewport.fitWorld()
    }

    public get viewport() {
        return this._viewport
    }

    public release() {
        this.viewport.destroy()
        window.removeEventListener('resize', this.update)
    }

    public update = () => {
        if (typeof this.screenSize === 'function') {
            const size = this.screenSize()
            this.viewport?.resize(size.x, size.y)
        }

        if (this.projection && this.project) {
            const sizeX = this.project.viewport.screenWidthInWorldPixels / this.project.viewport.worldWidth * this.project.viewport.worldWidth
            const sizeY = this.project.viewport.screenHeightInWorldPixels / this.project.viewport.worldHeight * this.project.viewport.worldHeight
    
            this.projection.width = sizeX
            this.projection.height = sizeY
            this.projection.position.set(this.project.viewport.corner.x, this.project.viewport.corner.y)
            this.viewport.position.set(this.project.viewport.screenWidth - this.viewport.screenWidth, 0)
        }

        this.background.width = this.mainView.width = this.labelView.width = this.viewport.worldWidth
        this.background.height = this.mainView.height = this.labelView.height = this.viewport.worldHeight

        this.handleUpdate()
    }

    public render(obj: Renderable) {

    }

    private handleProjectClick = ({ world }: { world: Pixi.Point }) => {
        this.project!.viewport.moveCenter(world.x, world.y)
        this.update()
    }

}

export default SpaceMap