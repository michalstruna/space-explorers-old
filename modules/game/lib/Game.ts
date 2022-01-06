import * as Pixi from 'pixi.js'
import { Viewport } from 'pixi-viewport'

import Http from '../../async/lib/Http'
import ShiftManager from '../../native/lib/ShiftManager'
import { GameOptions, StarData, StarsArea } from '../types'
import Star from './Star'
import SpaceMap from './SpaceMap'
import { pcToPx } from './Converter'

const MINIMAP_SIZE = 300

class Game {

    private app: Pixi.Application
    private map: SpaceMap
    private minimap: SpaceMap
    
    private stars: Map<number, Star> = new Map()

    public constructor({
        backgroundColor = 0x212121,
        nStars = 50,
        container = document.body
    }: GameOptions) {
        this.app = new Pixi.Application({
            resizeTo: window, // TODO: container
            backgroundColor: backgroundColor
        })

        container.appendChild(this.app.view)
        this.map = this.minimap = null as any

        Http.get<StarsArea>('stars', { n: nStars }).then(({ stars, size }) => {
            const pxSize = { x: pcToPx(size.x), y: pcToPx(size.y) }

            this.map = new SpaceMap({
                container: this.app.stage,
                screenSize: () => new Pixi.Point(window.innerWidth, window.innerHeight),
                worldSize: new Pixi.Point(pxSize.x, pxSize.y),
                interaction: this.app.renderer.plugins.interaction,
                backgroundColor: 0x151515,
                visibilityColor: 0x000000
            })
    
            this.minimap = new SpaceMap({
                container: this.app.stage,
                screenSize: new Pixi.Point(MINIMAP_SIZE, MINIMAP_SIZE),
                worldSize: new Pixi.Point(pxSize.x, pxSize.y),
                interaction: this.app.renderer.plugins.interaction,
                project: this.map,
                visibilityColor: 0x000000
            })

            this.initStars(stars)
        })
    }

    public release(): void {
        this.map.release()
        this.minimap.release()
    }

    private async initStars(stars: StarData[]): Promise<void> {
        for (const star of stars) {
            const tmp = new Star(star)
            this.map.render(tmp)
            this.minimap.render(tmp)
            this.stars.set(star.id, tmp)
        }
    }

}

export default Game