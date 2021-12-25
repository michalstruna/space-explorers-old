import * as Pixi from 'pixi.js'
import Random from 'random'

import { GameOptions } from '../types'

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

        for (let i = 0; i < 50; i++) {
            this.renderStar()
        }
    }

    private getRandomPoint(edge = 0): Pixi.Point {
        return new Pixi.Point(
            Random.int(edge, this.options.sizeX - edge),
            Random.int(edge, this.options.sizeY - edge)
        )
    }

    private renderStar(): void {
        const star = new Pixi.Graphics()
        const pos = this.getRandomPoint(20)

        star.beginFill(0xffffff)
        star.drawCircle(pos.x, pos.y, 15)
        star.endFill()
        this.pixi.stage.addChild(star)
    }

}

export default Game