import * as Pixi from 'pixi.js'

import { GameData, PlayerData, StarData } from '../types'
import Star from './Star'
import SpaceMap from './SpaceMap'
import { pcToPx } from './Converter'
import Collection from '../../native/lib/Collection'
import Player from './Player'
import Turn from './Turn'

const MINIMAP_SIZE = 300

class Game {

    private app: Pixi.Application
    private map: SpaceMap
    private minimap: SpaceMap
    
    private stars: Collection<Star>
    private players: Collection<Player>
    private turn: Turn

    public constructor(container: HTMLElement, {
        created,
        players,
        size,
        stars
    }: GameData) {
        this.stars = new Collection(stars.map(data => new Star({ ...data, owner: null })))
        this.players = new Collection(players.map(data => new Player({ ...data, stars: [], ships: [] })))
        this.populate(stars, players)

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

        this.app.ticker.add(this.handleTick)
        this.turn = new Turn({ players: this.players.toArray(), onChange: this.handleTurn })
    }

    public release(): void {
        this.map.release()
        this.minimap.release()
    }

    private populate(starsData: StarData[], playersData: PlayerData[]) {
        starsData.forEach(starData => {
            if (starData.owner) {
                const star = this.stars.get(starData.id)!
                star.owner = this.players.get(starData.owner)!
            }
        })

        // TODO: Populate ships.
    }

    private handleTick = () => {

    }

    private handleTurn = () => {
        for (const star of this.stars.toArray()) {
            this.map.render(star, this.turn)
            this.minimap.render(star, this.turn)
            this.stars.add(star)
        }
    }

}

export default Game