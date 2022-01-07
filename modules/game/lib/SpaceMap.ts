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
    background?: string
    backgroundColor?: number
    onUpdate?: () => void
}

class SpaceMap {

    private _viewport: Viewport
    private screenSize: Pixi.Point | (() => Pixi.Point)
    private handleUpdate: () => void
    private project?: SpaceMap

    private root = new Pixi.Sprite(Pixi.Texture.WHITE)
    private visibility = new Pixi.Sprite(Pixi.Texture.WHITE)
    private foreground = new Pixi.Container()
    private mainView = new Pixi.Container()
    private labelView = new Pixi.Container()
    private projection = new Pixi.Sprite(Pixi.Texture.WHITE)

    private background = new Pixi.Sprite(Pixi.Texture.WHITE)
    private backgroundBlur = new Pixi.filters.BlurFilter(0)

    private blur = new Pixi.filters.BlurFilter()
    private visibilityMask = new Pixi.Graphics()


    public constructor({
        screenSize,
        worldSize,
        container,
        interaction,
        project,
        background,
        backgroundColor,
        onUpdate = () => { }
    }: MapOptions) {
        this.screenSize = screenSize
        this.project = project
        container.addChild(this.root)
        this.root.tint = backgroundColor || 0x000000
        const size = screenSize instanceof Pixi.Point ? screenSize : screenSize()

        this._viewport = new Viewport({
            screenWidth: size.x,
            screenHeight: size.y,
            worldWidth: worldSize.x,
            worldHeight: worldSize.y,
            noTicker: !!project,
            stopPropagation: true,
            interaction: interaction
        })  

        if (background !== undefined) {
            this.background = Pixi.Sprite.from(background)
            this.background.filters = [this.backgroundBlur]
            this.root.addChild(this.background)
        }

        this.viewport.addChild(this.foreground)
        this.foreground.addChild(this.mainView)
        this.foreground.addChild(this.labelView)

        if (project) {
            //this.root.scale.set(size.x / worldSize.x, size.y / worldSize.y)
            this.viewport.resize(size.x, size.y)
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
        }

        //this.mainView.mask = this.visibilityMask
        //this.labelView.mask = this.visibilityMask
        //this.background.mask = this.visibilityMask
        //this.viewport.addChild(this.visibilityMask)
        this.mainView.filters = [this.blur]

        const updater = project ? project : this
        updater.viewport.on('moved', this.update)
        updater.viewport.on('zoomed', this.update)
        window.addEventListener('resize', this.update)

        this.handleUpdate = onUpdate
        this.root.addChild(this.viewport)
        this.viewport.fitWorld()
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

        if (this.projection && this.project) {
            const sizeX = this.project.viewport.screenWidthInWorldPixels / this.project.viewport.worldWidth * this.project.viewport.worldWidth
            const sizeY = this.project.viewport.screenHeightInWorldPixels / this.project.viewport.worldHeight * this.project.viewport.worldHeight
    
            this.projection.width = sizeX
            this.projection.height = sizeY
            this.projection.position.set(this.project.viewport.corner.x, this.project.viewport.corner.y)
            this.root.position.set(this.project.viewport.screenWidth - this.viewport.screenWidth, 0)

            this.background.width = this.background.height = this.viewport.screenWidth
            //this.background.height = this.viewport.screenHeight
        } else {
            this.background.width = this.background.height = this.viewport.screenWidth * 1.5
            //this.background.height = this.viewport.screenHeight * 1.5
            this.background.position.set(-this.viewport.center.x / 20, -this.viewport.center.y / 20)
            this.backgroundBlur.blur = this.viewport.scale.x * 5
        }

        this.visibility.width = this.viewport.worldWidth
        this.visibility.height = this.viewport.worldHeight

        this.blur.blur = (this.viewport.scale?.x || 1) * 10

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