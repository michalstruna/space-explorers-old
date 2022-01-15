import * as Pixi from 'pixi.js'

import { GameData, PlayerData, StarData } from '../types'
import Star from './Star'
import SpaceMap from './SpaceMap'
import { pcToPx } from './Converter'
import Collection from '../../utils/lib/Collection'
import Player from './Player'
import Turn from './Turn'
import Events from './Events'
import GameObject from './GameObject'

const MINIMAP_SIZE = 300

class Game {

    private app: Pixi.Application
    private map: SpaceMap
    private minimap: SpaceMap
    
    private stars: Collection<Star>
    private rendered = new Collection<GameObject, Pixi.DisplayObject>()
    private players: Collection<Player>
    private turn: Turn
    private events: Events

    public constructor({
        container,
        events,
        created,
        players,
        size,
        stars
    }: GameData<true>) {
        this.stars = new Collection(stars.map(data => new Star({ ...data, owner: null, events })))
        this.players = new Collection(players.map(data => new Player({ ...data, stars: [], ships: [] })))
        this.events = events
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

        this.map.viewport.on('click', (e) => {
            const target = this.rendered.get(e.target)
            if (target) events.emit('click', target)
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
            const star = this.stars.get(starData.id)!
            this.rendered.set(star.graphics, star)
            if (starData.owner) star.owner = this.players.get(starData.owner)!
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