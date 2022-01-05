import * as Pixi from 'pixi.js'

import { Viewport } from 'pixi-viewport'

type MapUpdateHandler = () => void

type MapOptions = {
    screenSize: Pixi.Point | (() => Pixi.Point)
    worldSize: Pixi.Point
    container: Pixi.Container
    interaction: Pixi.InteractionManager

    projectView?: Viewport
    ticker?: boolean
    backgroundColor?: number
    onUpdate?: () => void
}

class Map {

    private _viewport: Viewport
    private screenSize: Pixi.Point | (() => Pixi.Point)
    private handleUpdate: MapUpdateHandler
    private background?: Pixi.Sprite
    private projectView?: Viewport
    private projection?: Pixi.Sprite

    public constructor({
        screenSize,
        worldSize,
        container,
        interaction,
        projectView,
        ticker,
        backgroundColor,
        onUpdate = () => { }
    }: MapOptions) {
        const size = screenSize instanceof Pixi.Point ? screenSize : screenSize()
        this.screenSize = screenSize
        this.projectView = projectView

        this._viewport = new Viewport({
            screenWidth: size.x,
            screenHeight: size.y,
            worldWidth: worldSize.x,
            worldHeight: worldSize.y,
            noTicker: !ticker,
            stopPropagation: true,
            interaction: interaction
        })

        if (backgroundColor !== undefined) {
            this.background = new Pixi.Sprite(Pixi.Texture.WHITE)
            this.background.tint = backgroundColor || 0
            this.viewport.addChild(this.background)
        }

        if (projectView) {
            this.projection = new Pixi.Sprite(Pixi.Texture.WHITE)
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

        const updater = projectView ? projectView : this.viewport
        updater.on('moved', this.update)
        updater.on('zoomed', this.update)
        window.addEventListener('resize', this.update)

        this.handleUpdate = onUpdate
        container.addChild(this.viewport)
        this.update()
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

        if (this.projection && this.projectView) {
            const sizeX = this.projectView.screenWidthInWorldPixels / this.projectView.worldWidth * this.projectView.worldWidth
            const sizeY = this.projectView.screenHeightInWorldPixels / this.projectView.worldHeight * this.projectView.worldHeight
    
            this.projection.width = sizeX
            this.projection.height = sizeY
            this.projection.position.set(this.projectView.corner.x, this.projectView.corner.y)
            this.viewport.position.set(this.projectView.screenWidth - this.viewport.screenWidth, 0)
        }

        if (this.background) {
            this.background.width = this.viewport.worldWidth
            this.background.height = this.viewport.worldHeight
        }

        this.handleUpdate()
    }

    private handleProjectClick = ({ world }: { world: Pixi.Point }) => {
        this.projectView?.moveCenter(world.x, world.y)
        this.update()
    }

}

export default Map