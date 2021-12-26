import * as Pixi from 'pixi.js'
import ShiftManager from '../../native/lib/ShiftManager'

import { GameOptions } from '../types'
import { getPoints } from './Generator'

class Game {

    private options: GameOptions
    private pixi: Pixi.Application
    private shiftManager: ShiftManager
    
    private starsContainer = new Pixi.Container()

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

    private initStars(): void {
        this.pixi.stage.addChild(this.starsContainer)

        const blurFilter = new Pixi.filters.BlurFilter(10)
        this.starsContainer.filters = [blurFilter]

        const STARS = 100
        const EDGE = 50

        const starPoints = getPoints({
            n: STARS,
            minX: EDGE,
            maxX: this.options.sizeX - EDGE,
            minY: EDGE,
            maxY: this.options.sizeY - EDGE,
            minDistance: 250,
        })

        starPoints.forEach(pos => {
            const star = new Pixi.Graphics()
            star.beginFill(0xffffff)
            star.drawCircle(pos.x, pos.y, 15)
            star.endFill()
            this.starsContainer.addChild(star)
        })
    }

}

export default Game