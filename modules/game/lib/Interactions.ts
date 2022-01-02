import * as Pixi from 'pixi.js'
import { Viewport } from 'pixi-viewport'

type ViewportOptions = {
    app: Pixi.Application
    sizeX: number
    sizeY: number
}

const MINIMAP_SIZE = 300

class Interactions {

    private app: Pixi.Application
    private _viewport: Viewport
    private _minimap: Viewport
    private options: ViewportOptions

    private minimapView = new Pixi.Sprite(Pixi.Texture.WHITE)

    public constructor(options: ViewportOptions) {
        this.app = options.app
        this.options = options
        this._viewport = this._minimap = null as any

        this.initViewport()
        this.initMinimap()
        this.viewport.fitWorld()
    }

    public get viewport() {
        return this._viewport
    }

    public get minimap() {
        return this._minimap
    }

    public release() {
        window.removeEventListener('resize', this.handleResize)
        this._viewport.destroy()
        this._minimap.destroy()
    }

    private handleResize = () => {
        this.viewport?.resize(window.innerWidth, window.innerHeight, this.options.sizeX, this.options.sizeY)
        this.updateMinimap()
    }

    private initViewport() {
        this._viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: this.options.sizeX,
            worldHeight: this.options.sizeY
        }).drag().pinch().wheel().decelerate().clamp({
            direction: 'all',
            underflow: 'center'
        }).clampZoom({
            maxWidth: this.options.sizeX,
            maxHeight: this.options.sizeY,
            minHeight: 200
        })

        this.app.stage.addChild(this.viewport)
        window.addEventListener('resize', this.handleResize)
    }

    private initMinimap() {
        this._minimap = new Viewport({
            screenWidth: MINIMAP_SIZE,
            screenHeight: MINIMAP_SIZE,
            worldWidth: this.options.sizeX,
            worldHeight: this.options.sizeY,
            stopPropagation: true,
            noTicker: true
        })

        this.minimap.scale.set(MINIMAP_SIZE / this.options.sizeX, MINIMAP_SIZE / this.options.sizeY)
        this.app.stage.addChild(this.minimap)

        this.minimapView.alpha = 0.25
        this.minimapView.tint = 0xFFFFFF

        const mapBackground = new Pixi.Sprite(Pixi.Texture.WHITE)
        mapBackground.tint = 0x000000
        mapBackground.width = this.options.sizeX
        mapBackground.height = this.options.sizeY
        
        this.minimap.addChild(mapBackground)
        this.minimap.addChild(this.minimapView)

        this.viewport.on('moved', this.updateMinimap)
        this.viewport.on('zoomed', this.updateMinimap)
        this.minimap.on('clicked', this.onClickMinimap)
    }

    private updateMinimap = () => {
        const sizeX = this.viewport.screenWidthInWorldPixels / this.viewport.worldWidth * this.viewport.worldWidth
        const sizeY = this.viewport.screenHeightInWorldPixels / this.viewport.worldHeight * this.viewport.worldHeight

        this.minimapView.width = sizeX
        this.minimapView.height = sizeY
        this.minimapView.position.set(this.viewport.corner.x, this.viewport.corner.y)
        this.minimap.position.set(this.viewport.screenWidth - MINIMAP_SIZE, 0)
    }

    private onClickMinimap = ({ world }: any) => {
        this.viewport.moveCenter(world.x, world.y)
        this.updateMinimap()
    }

}

export default Interactions