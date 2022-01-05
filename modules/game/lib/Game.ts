import * as Pixi from 'pixi.js'
import { Viewport } from 'pixi-viewport'

import Http from '../../async/lib/Http'
import ShiftManager from '../../native/lib/ShiftManager'
import { GameOptions, StarData, StarsArea } from '../types'
import Star from './Star'
import SpaceMap from './SpaceMap'

const PC_TO_PX = 300
const PC_TO_MINI_PX = 1
const MINIMAP_SIZE = 300

class Game {

    private app: Pixi.Application
    private map: SpaceMap
    private minimap: SpaceMap
    
    private starsContainer = new Pixi.Container()
    private starsBlurFilter = new Pixi.filters.BlurFilter()
    private starLabelsContainer = new Pixi.Container()
    
    private stars: Map<number, Star> = new Map()

    public static toPx(pc: number) {
        return Math.floor(pc * PC_TO_PX)
    }

    public static toMiniPx(pc: number) {
        return Math.floor(pc * PC_TO_MINI_PX)
    }

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
            const pxSize = { x: Game.toPx(size.x), y: Game.toPx(size.y) }

            this.map = new SpaceMap({
                container: this.app.stage,
                screenSize: () => new Pixi.Point(window.innerWidth, window.innerHeight),
                worldSize: new Pixi.Point(pxSize.x, pxSize.y),
                interaction: this.app.renderer.plugins.interaction,
                ticker: true
            })
    
            this.minimap = new SpaceMap({
                container: this.app.stage,
                screenSize: new Pixi.Point(MINIMAP_SIZE, MINIMAP_SIZE),
                worldSize: new Pixi.Point(pxSize.x, pxSize.y),
                interaction: this.app.renderer.plugins.interaction,
                projectView: this.map.viewport,
                backgroundColor: 0x000000
            })

            this.initStars(stars)
            this.app.ticker.add(this.tick)
        })
    }

    public release(): void {
        this.map.release()
        this.minimap.release()
    }

    private async initStars(stars: StarData[]): Promise<void> {
        this.map.viewport.addChild(this.starsContainer)
        this.map.viewport.addChild(this.starLabelsContainer)
        this.starsContainer.filters = [this.starsBlurFilter]
        
        for (const star of stars) {
            const tmp = new Star(star)
            this.starsContainer.addChild(tmp.render())
            this.minimap.viewport.addChild(tmp.renderMini())
            this.starLabelsContainer.addChild(tmp.renderLabel())
            this.stars.set(star.id, tmp)
        }
    }

    private tick = (): void => {
        this.starsBlurFilter.blur = (this.map.viewport.scale?.x || 1) * 10
    }

}

export default Game