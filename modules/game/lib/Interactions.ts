import * as Pixi from 'pixi.js'

import Map from './Map'

type ViewportOptions = {
    app: Pixi.Application
    sizeX: number
    sizeY: number
}

const MINIMAP_SIZE = 300

class Interactions {

    private app: Pixi.Application
    private options: ViewportOptions

    private _map: Map
    private _minimap: Map

    public constructor(options: ViewportOptions) {
        this.app = options.app
        this.options = options

        this._map = new Map({
            container: this.app.stage,
            screenSize: () => new Pixi.Point(window.innerWidth, window.innerHeight),
            worldSize: new Pixi.Point(options.sizeX, options.sizeY),
            interaction: this.app.renderer.plugins.interaction
        })

        this._minimap = new Map({
            container: this.app.stage,
            screenSize: new Pixi.Point(MINIMAP_SIZE, MINIMAP_SIZE),
            worldSize: new Pixi.Point(options.sizeX, options.sizeY),
            interaction: this.app.renderer.plugins.interaction,
            projectView: this._map.viewport,
            backgroundColor: 0x000000
        })

        this.map.viewport.fitWorld()
    }

    public get map() {
        return this._map
    }

    public get minimap() {
        return this._minimap
    }

    public release() {
        this.map.release()
        this.minimap.release()
    }

}

export default Interactions