import * as Pixi from 'pixi.js'
import { Viewport } from 'pixi-viewport'

import Http from '../../async/lib/Http'
import ShiftManager from '../../native/lib/ShiftManager'
import { GameOptions, StarData, StarsArea } from '../types'
import Interactions from './Interactions'

const PC_TO_PX = 300
const toPx = (pc: number) => Math.floor(pc * PC_TO_PX)

class Game {

    private app: Pixi.Application

    private interactions: Interactions
    private viewport: Viewport
    
    private starsContainer = new Pixi.Container()
    private starsBlurFilter = new Pixi.filters.BlurFilter()
    private starLabelsContainer = new Pixi.Container()

    public constructor({ backgroundColor = 0x212121, nStars = 50, container = document.body }: Partial<GameOptions>) {
        this.app = new Pixi.Application({
            resizeTo: window, // TODO: container
            backgroundColor: backgroundColor
        })

        container.appendChild(this.app.view)

        this.interactions = this.viewport = null as any

        Http.get<StarsArea>('stars', { n: nStars }).then(({ stars, size }) => {
            this.interactions = new Interactions({ app: this.app, sizeX: toPx(size.x), sizeY: toPx(size.y) })
            this.viewport = this.interactions.viewport
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

        stars.forEach(star => {
            const g = new Pixi.Graphics()
            g.beginFill(0xffffff)
            g.drawCircle(toPx(star.x), toPx(star.y), 10)
            g.endFill()
            this.starsContainer.addChild(g)

            const label = new Pixi.Text(star.name + ` ${toPx(star.x)}`, { fill: 0xAAAAAA, align: 'center', fontFamily: 'Arial', fontSize: 14 })
            label.x = toPx(star.x)
            label.y = toPx(star.y) + 30
            label.anchor.set(0.5, 0.5)
            this.starLabelsContainer.addChild(label)
        })
    }

    private tick = (): void => {
        this.starsBlurFilter.blur = (this.viewport.scale?.x || 1) * 10
        console.log(this.viewport.scale.x)
    }

}

export default Game