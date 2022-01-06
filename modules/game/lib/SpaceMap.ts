import * as Pixi from 'pixi.js'

import { Viewport } from 'pixi-viewport'
import { Renderable } from '../types'
import { pcToPx } from './Converter'

type MapOptions = {
    screenSize: Pixi.Point | (() => Pixi.Point)
    worldSize: Pixi.Point
    container: Pixi.Container
    interaction: Pixi.InteractionManager

    project?: SpaceMap
    backgroundColor?: number
    visibilityColor?: number
    onUpdate?: () => void
}

class SpaceMap {

    private _viewport: Viewport
    private screenSize: Pixi.Point | (() => Pixi.Point)
    private handleUpdate: () => void
    private project?: SpaceMap

    private visibility = new Pixi.Sprite(Pixi.Texture.WHITE)
    private foreground = new Pixi.Container()
    private mainView = new Pixi.Container()
    private background = new Pixi.Sprite(Pixi.Texture.WHITE)
    private labelView = new Pixi.Container()
    private projection = new Pixi.Sprite(Pixi.Texture.WHITE)

    private blur = new Pixi.filters.BlurFilter()
    private visibilityMask = new Pixi.Graphics()


    public constructor({
        screenSize,
        worldSize,
        container,
        interaction,
        project,
        backgroundColor,
        visibilityColor,
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
            this.background = Pixi.Sprite.from('./background.jpg')
            this.foreground.addChild(this.background)
        }

        if (visibilityColor !== undefined) {
            this.viewport.addChild(this.visibility)
            this.visibility.tint = visibilityColor
        }

        this.viewport.addChild(this.foreground)
        this.foreground.addChild(this.mainView)
        this.foreground.addChild(this.labelView)

        if (project) {
            this.viewport.scale.set(size.x / worldSize.x, size.y / worldSize.y)
            this.viewport.addChild(this.projection)
            this.projection.alpha = 0.15
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

            this.mainView.filters = [this.blur]
        }

        //this.mainView.mask = this.visibilityMask
        //this.labelView.mask = this.visibilityMask
        //this.background.mask = this.visibilityMask
        //this.foreground.addChild(this.visibilityMask)
        this.mainView.filters = [this.blur]

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

        this.visibility.width = this.background.width = this.viewport.worldWidth
        this.visibility.height = this.background.height = this.viewport.worldHeight
        this.blur.blur = (this.viewport.scale?.x || 1) * 10

        this.background.position.set(this.foreground.position.x, this.foreground.position.y)

        this.handleUpdate()
    }

    public render(obj: Renderable) {
        if (this.project) {
            this.mainView.addChild(obj.renderMini())
        } else {
            this.mainView.addChild(obj.render())
            this.labelView.addChild(obj.renderLabel())
        }

        const visibility = new Pixi.Graphics()
        visibility.beginFill(0xFFFFFF)
        visibility.drawCircle(pcToPx(obj.position.x), pcToPx(obj.position.y), obj.visibility)
        visibility.endFill()
        this.visibilityMask.addChild(visibility)
    }

    private handleProjectClick = ({ world }: { world: Pixi.Point }) => {
        this.project!.viewport.moveCenter(world.x, world.y)
        this.update()
    }

}

export default SpaceMap