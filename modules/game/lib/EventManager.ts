import { Point } from '../types'
import GameObject from './GameObject'

interface EventArgs {
    object?: GameObject
    world?: Point
    screen?: Point
}

type EventHandler = (data: EventArgs) => void

interface EventsManagerOptions {
    click?: EventHandler
}

class EventManager {

    public readonly click?: EventHandler

    constructor(options: EventsManagerOptions) {
        this.click = options.click
    }

}

export default EventManager