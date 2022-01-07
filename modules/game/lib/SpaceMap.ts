import * as Pixi from 'pixi.js'

import { Viewport } from 'pixi-viewport'
import { Point, Renderable } from '../types'
import { pcToPx } from './Converter'

type MainMapOptions = {
    worldSize: Point
    interaction: Pixi.InteractionManager
}

type ProjectedMapOptions = {
    project: SpaceMap
}

type Background = number | string

type MapOptions = (MainMapOptions | ProjectedMapOptions) & {
    screenSize: Point | (() => Point)
    container: Pixi.Container
    onUpdate?: () => void

    background?: Background
    overlay?: Background
}

class SpaceMap {

    private _viewport: Viewport
    private _interaction: Pixi.InteractionManager
    private screenSize: Point | (() => Point)
    private handleUpdate: () => void
    private project?: SpaceMap

    private root = new Pixi.Container()
    private visibility = new Pixi.Sprite(Pixi.Texture.WHITE)
    private foreground = new Pixi.Container()
    private mainView = new Pixi.Container()
    private labelView = new Pixi.Container()
    private projection = new Pixi.Sprite(Pixi.Texture.WHITE)

    private _overlay?: Background
    private _background?: Background
    private overlayObj = new Pixi.Sprite()
    private backgroundObj = new Pixi.Sprite()

    private backgroundObjBlur = new Pixi.filters.BlurFilter(0)

    private blur = new Pixi.filters.BlurFilter()
    private visibilityMask = new Pixi.Graphics()


    public constructor({
        screenSize,
        container,
        overlay,
        background,
        onUpdate = () => { },
        ...options
    }: MapOptions) {
        this.screenSize = screenSize
        container.addChild(this.root)
        const size = typeof screenSize === 'object' ? screenSize : screenSize()
        const isProjected = 'project' in options
        const worldSize = isProjected ? options.project.worldSize : options.worldSize
        this.project = isProjected ? options.project : undefined
        this._interaction = isProjected ? options.project.interaction : options.interaction

        this._viewport = new Viewport({
            screenWidth: size.x,
            screenHeight: size.y,
            worldWidth: worldSize.x,
            worldHeight: worldSize.y,
            noTicker: !!this.project,
            stopPropagation: true,
            interaction: this.interaction
        })

        if (overlay !== undefined || this.project?.overlay !== undefined) {
            this._overlay = overlay ?? this.project!.overlay
            if (this.project) console.log(111, this.overlay)
            this.overlayObj = this.getBackground(this.overlay!)
            this.root.addChild(this.overlayObj)
        }

        if (background !== undefined || this.project?.background !== undefined) {
            this._background = background ?? this.project!.background
            this.backgroundObj = this.getBackground(this.background!)
            this.backgroundObj.filters = [this.backgroundObjBlur]
            this.backgroundObj.mask = this.visibilityMask
            this.root.addChild(this.backgroundObj)
        }

        this.viewport.addChild(this.foreground)
        this.foreground.addChild(this.mainView)
        this.foreground.addChild(this.labelView)

        if (isProjected) {
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

        this.mainView.mask = this.visibilityMask
        this.labelView.mask = this.visibilityMask
        this.viewport.addChild(this.visibilityMask)
        this.mainView.filters = [this.blur]

        const updater = isProjected ? options.project : this
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

            this.backgroundObj.width = this.backgroundObj.height = this.overlayObj.width = this.overlayObj.height = this.viewport.screenWidth
        } else {
            this.backgroundObj.width = this.backgroundObj.height = this.overlayObj.width = this.overlayObj.height = this.viewport.screenWidth * 1.5
            this.backgroundObj.position.set(-this.viewport.center.x / 20, -this.viewport.center.y / 20)
            this.backgroundObjBlur.blur = this.viewport.scale.x * 5
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

    public get worldSize(): Point {
        return { x: this.viewport.worldWidth, y: this.viewport.worldHeight }
    }

    public get interaction(): Pixi.InteractionManager {
        return this._interaction
    }

    public get background() {
        return this._background
    }

    public get overlay() {
        return this._overlay
    }

    private handleProjectClick = ({ world }: { world: Pixi.Point }) => {
        this.project!.viewport.moveCenter(world.x, world.y)
        this.update()
    }

    /**
     * Get color or texture backgroundObj.
     */
    private getBackground(background: Background): Pixi.Sprite {
        if (typeof background === 'number') {
            const result = new Pixi.Sprite(Pixi.Texture.WHITE)
            result.tint = background
            return result
        } else {
            const result = Pixi.Sprite.from(background)
            return result
        }
    }

}

export default SpaceMap