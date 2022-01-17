import EventEmitter from 'eventemitter3'

type EventName = string

class Events extends EventEmitter<string> {

    /** Minimum time gap between two emits of the same  */
    private static readonly MIN_TIME_GAP = 50

    private lastEmits: Record<EventName, number> = {}

    public emit(event: EventName, ...args: any[]) {
        if (!this.lastEmits[event]) this.lastEmits[event] = 0
        if (this.lastEmits[event] > Date.now() - Events.MIN_TIME_GAP) return false
        this.lastEmits[event] = Date.now()
        return super.emit(event, ...args)
    }

    public on(event: string, fn: EventEmitter.ListenerFn, context?: any): this {
        this.off(event)
        super.on(event, fn, context)
        return this
    }

}

export default Events