import * as Pixi from 'pixi.js'
import Random from 'random'

import { GameOptions } from '../types'
import { getPoints } from './Generator'

class Game {

    private options: GameOptions
    private pixi: Pixi.Application

    public constructor(options: GameOptions) {
        this.options = options

        this.pixi = new Pixi.Application({
            resizeTo: window,
            backgroundColor: options.backgroundColor
        })
        options.container.current?.appendChild(this.pixi.view)

        this.initStars()
    }

    private initStars(): void {
        const STARS = 40
        const EDGE = 50

        const starPoints = getPoints({
            n: STARS,
            minX: EDGE,
            maxX: this.options.sizeX - EDGE,
            minY: EDGE,
            maxY: this.options.sizeY - EDGE,
            minDistance: 100,
        })

        starPoints.forEach(pos => {
            const star = new Pixi.Graphics()
    
            star.beginFill(0xffffff)
            star.drawCircle(pos.x, pos.y, 15)
            star.endFill()
            this.pixi.stage.addChild(star)
        })
    }

}

export default Game