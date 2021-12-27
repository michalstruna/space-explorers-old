import * as Pixi from 'pixi.js'
import Http from '../../async/lib/Http'
import ShiftManager from '../../native/lib/ShiftManager'

import { GameOptions } from '../types'
import { getPoints } from './Generator'

class Game {

    private options: GameOptions
    private pixi: Pixi.Application
    private shiftManager: ShiftManager
    
    private starsContainer = new Pixi.Container()
    private starLabelsContainer = new Pixi.Container()

    public constructor(options: GameOptions) {
        this.options = options

        this.pixi = new Pixi.Application({
            resizeTo: window,
            backgroundColor: options.backgroundColor
        })
        options.container.current?.appendChild(this.pixi.view)

        this.shiftManager = new ShiftManager({
            keyboard: { speed: 10 },
            dragAndDrop: { treshold: 10 },
            resize: true,
            onX: change => this.pixi.stage.x = Math.max(-this.options.sizeX + window.innerWidth, Math.min(0, this.pixi.stage.x - change)),
            onY: change => this.pixi.stage.y = Math.max(-this.options.sizeY + window.innerHeight, Math.min(0, this.pixi.stage.y - change)),
        })

        this.initStars()

        this.pixi.ticker.add(() => {

        })
    }

    public end(): void {
        this.shiftManager.release()
    }

    private async initStars(): Promise<void> {
        this.pixi.stage.addChild(this.starsContainer)
        this.pixi.stage.addChild(this.starLabelsContainer)

        const blurFilter = new Pixi.filters.BlurFilter(10)
        this.starsContainer.filters = [blurFilter]

        const STARS = 500
        const EDGE = 50

        const stars = await Http.get<any[]>('stars', { n: STARS })

        const starPoints = getPoints({
            n: STARS,
            minX: EDGE,
            maxX: this.options.sizeX - EDGE,
            minY: EDGE,
            maxY: this.options.sizeY - EDGE,
            minDistance: 250,
        })

        stars.forEach((star: any) => {
            const g = new Pixi.Graphics()
            g.beginFill(0xffffff)
            g.drawCircle(star.x * 200, star.y * 200, 15)
            g.endFill()
            this.starsContainer.addChild(g)

            const label = new Pixi.Text(star.name, { fill: 0xAAAAAA, align: 'center', fontFamily: 'Arial', fontSize: 14 })
            label.x = star.x * 200
            label.y = star.y * 200 + 30
            label.anchor.set(0.5, 0.5)
            this.starLabelsContainer.addChild(label)
        })
    }

}

export default Game