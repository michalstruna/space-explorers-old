import * as Pixi from 'pixi.js'

import Http from '../../async/lib/Http'
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
        backgroundColor = 0x000000,
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
                screenSize: () => ({ x: window.innerWidth, y: window.innerHeight }),
                worldSize: { x: pxSize.x, y: pxSize.y },
                interaction: this.app.renderer.plugins.interaction,
                background: `backgrounds/1.jpg`,
                overlay: 0x000000
            })
    
            this.minimap = new SpaceMap({
                container: this.app.stage,
                screenSize: { x: MINIMAP_SIZE, y: MINIMAP_SIZE },
                project: this.map
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