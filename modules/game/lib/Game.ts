import * as Pixi from 'pixi.js'

import { GameData, StarData } from '../types'
import Star from './Star'
import SpaceMap from './SpaceMap'
import { pcToPx } from './Converter'
import Collection from '../../native/lib/Collection'
import Player from './Player'

const MINIMAP_SIZE = 300

class Game {

    private app: Pixi.Application
    private map: SpaceMap
    private minimap: SpaceMap
    
    private stars: Collection<Star>
    private players: Collection<Player>

    public constructor(container: HTMLElement, {
        created,
        players,
        size,
        stars
    }: GameData) {
        this.stars = new Collection(stars.map(data => new Star(data)))
        this.players = new Collection(players.map(data => new Player(data)))

        console.log(players, stars)

        this.app = new Pixi.Application({
            resizeTo: window, // TODO: container
            backgroundColor: 0x000000
        })

        container.appendChild(this.app.view)

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
            this.stars.add(tmp)
        }
    }

}

export default Game