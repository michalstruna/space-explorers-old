import * as Pixi from 'pixi.js'
import { Viewport } from 'pixi-viewport'

type ViewportOptions = {
    app: Pixi.Application
    sizeX: number
    sizeY: number
}

class Interactions {

    private app: Pixi.Application
    private _viewport: Viewport
    private options: ViewportOptions

    public constructor(options: ViewportOptions) {
        this.app = options.app
        this.options = options

        this._viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: options.sizeX,
            worldHeight: options.sizeY
        }).drag().pinch().wheel().decelerate().clamp({
            direction: 'all',
            underflow: 'center'
        }).clampZoom({
            maxWidth: options.sizeX,
            maxHeight: options.sizeY,
            minHeight: 200
        })

        this.app.stage.addChild(this.viewport)
        this.viewport.fitWorld()

        window.addEventListener('resize', this.handleResize)
    }

    public get viewport() {
        return this._viewport
    }

    public release() {
        window.removeEventListener('resize', this.handleResize)
        this._viewport.destroy()
    }

    private handleResize() {
        this.viewport?.resize(window.innerWidth, window.innerWidth, this.options.sizeX, this.options.sizeY)
    }

}

export default Interactions