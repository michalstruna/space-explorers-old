import * as Pixi from 'pixi.js'
import ShiftManager from '../../native/lib/ShiftManager'

import { GameOptions } from '../types'
import { getPoints } from './Generator'

class Game {

    private options: GameOptions
    private pixi: Pixi.Application
    private shiftManager: ShiftManager
    
    private starsContainer = new Pixi.Container()
    private shift = { x: 0, y: 0 }

    public constructor(options: GameOptions) {
        this.options = options

        this.pixi = new Pixi.Application({
            resizeTo: window,
            backgroundColor: options.backgroundColor
        })
        options.container.current?.appendChild(this.pixi.view)

        const limitShiftX = (shift: number) => Math.max(-this.options.sizeX + window.innerWidth, Math.min(0, shift))
        const limitShiftY = (shift: number) => Math.max(-this.options.sizeY + window.innerHeight, Math.min(0, shift))

        this.shiftManager = new ShiftManager({
            keyboard: true,
            onX: change => this.shift.x = limitShiftX(this.shift.x - change * 10),
            onY: change => this.shift.y = limitShiftY(this.shift.y - change * 10),
            onResize: () => {
                this.shift.x = limitShiftX(this.shift.x)
                this.shift.y = limitShiftY(this.shift.y)
            }
        })

        this.initStars()

        this.pixi.ticker.add(() => {
            this.shiftManager.tick()

            console.log(this.shift, this.options.sizeX)
            
            this.pixi.stage.x = this.shift.x
            this.pixi.stage.y = this.shift.y
        })
    }

    public end(): void {
        this.shiftManager.release()
    }

    private initStars(): void {
        this.pixi.stage.addChild(this.starsContainer)

        const STARS = 300
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
            this.starsContainer.addChild(star)
        })
    }

}

export default Game