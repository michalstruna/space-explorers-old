import * as Pixi from 'pixi.js'
import { Viewport } from 'pixi-viewport'

import Http from '../../async/lib/Http'
import ShiftManager from '../../native/lib/ShiftManager'
import { GameOptions, StarData, StarsArea } from '../types'
import Interactions from './Interactions'
import Star from './Star'

const PC_TO_PX = 300
const PC_TO_MINI_PX = 1

class Game {

    private app: Pixi.Application

    private interactions: Interactions
    private viewport: Viewport
    private minimap: Viewport
    
    private starsContainer = new Pixi.Container()
    private starsBlurFilter = new Pixi.filters.BlurFilter()
    private starLabelsContainer = new Pixi.Container()
    private stars: Record<number, Star> = {}

    public static toPx(pc: number) {
        return Math.floor(pc * PC_TO_PX)
    }

    public static toMiniPx(pc: number) {
        return Math.floor(pc * PC_TO_MINI_PX)
    }

    public constructor({ backgroundColor = 0x212121, nStars = 50, container = document.body }: Partial<GameOptions>) {
        this.app = new Pixi.Application({
            resizeTo: window, // TODO: container
            backgroundColor: backgroundColor
        })

        container.appendChild(this.app.view)
        this.interactions = this.viewport = this.minimap = null as any

        Http.get<StarsArea>('stars', { n: nStars }).then(({ stars, size }) => {
            this.interactions = new Interactions({ app: this.app, sizeX: Game.toPx(size.x), sizeY: Game.toPx(size.y) })
            this.viewport = this.interactions.viewport
            this.minimap = this.interactions.minimap
            this.initStars(stars)
            this.app.ticker.add(this.tick)
        })
    }

    public release(): void {
        this.interactions.release()
    }

    private async initStars(stars: StarData[]): Promise<void> {
        this.viewport.addChild(this.starsContainer)
        this.viewport.addChild(this.starLabelsContainer)
        this.starsContainer.filters = [this.starsBlurFilter]
        stars.forEach(star => this.stars[star.id] = new Star({ ...star, container: this.starsContainer, minimap: this.minimap, labelContainer: this.starLabelsContainer }))
    }

    private tick = (): void => {
        this.starsBlurFilter.blur = (this.viewport.scale?.x || 1) * 10
        console.log(111, this.viewport.width, this.viewport.height)
    }

}

export default Game