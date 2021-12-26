import KeyCode from 'keycode'

type Handler = (change: number) => void

type ShiftOptions = {
    resize?: boolean
    keyboard?: Partial<AccessOptions>
    swipe?: Partial<AccessOptions>
    dragAndDrop?: Partial<AccessOptions>

    onX?: Handler
    onY?: Handler
}

type AccessOptions = {
    treshold: number
    speed: number
}

class EventHandler<EventType extends Event> {

    private element: Window | Document | HTMLElement
    private eventName: string
    private handler: (e: EventType) => void

    public constructor(
        element: Window | Document | HTMLElement,
        eventName: string,
        handler: (e: EventType) => void
    ) {
        this.element = element
        this.eventName = eventName
        this.handler = handler
    }

    public init(): void {
        this.element.addEventListener(this.eventName, this.handler as EventListenerOrEventListenerObject)
    }

    public release(): void {
        this.element.removeEventListener(this.eventName, this.handler as EventListenerOrEventListenerObject)
    }

}

class ShiftManager {

    private options: ShiftOptions
    private pressed: Set<string> = new Set()

    private mousePosTreshold = { x: false, y: false }
    private prevMousePos: { x: number, y: number } | null = null
    private mousePos: { x: number, y: number } = { x: 0, y: 0 }

    private interval: NodeJS.Timer

    private handleKeyDown = (e: Event) => {
        this.pressed.add(KeyCode(e))
    }

    private handleKeyUp = (e: Event) => {
        this.pressed.delete(KeyCode(e))
    }

    private handleResize = () => {
        this.options.onX?.(0)
        this.options.onY?.(0)
    }

    private handleMouseDown = (e: MouseEvent) => {
        this.mousePosTreshold = { x: true, y: true }
        this.prevMousePos = { x: e.pageX, y: e.pageY }
        this.mousePos = { x: e.pageX, y: e.pageY }
    }

    private handleMouseMove = (e: MouseEvent) => {
        this.mousePos.x = e.pageX
        this.mousePos.y = e.pageY
    }

    private handleMouseUp = () => {
        this.prevMousePos = null
    }

    private eventHandlers = [
        new EventHandler(window, 'resize', this.handleResize)
    ]

    private keyEventHandlers = [
        new EventHandler(window, 'keydown', this.handleKeyDown),
        new EventHandler(window, 'keyup', this.handleKeyUp)
    ]

    private dragAndDropHandlers = [
        new EventHandler(document, 'mousedown', this.handleMouseDown),
        new EventHandler(document, 'mouseup', this.handleMouseUp),
        new EventHandler(document, 'mousemove', this.handleMouseMove)
    ]

    private swipeHandlers = [

    ] as EventHandler<Event>[]

    public constructor(options: ShiftOptions) {
        this.options = options
        if (options.keyboard) options.keyboard = { speed: 1, treshold: 1, ...options.keyboard }
        if (options.dragAndDrop) options.dragAndDrop = { speed: 1, treshold: 1, ...options.dragAndDrop }
        if (options.swipe) options.swipe = { speed: 1, treshold: 1, ...options.swipe }

        this.interval = setInterval(this.tick, 20)

        this.eventHandlers.forEach(h => h.init())
        if (options.keyboard) this.keyEventHandlers.forEach(h => h.init())
        if (options.dragAndDrop) this.dragAndDropHandlers.forEach(h => h.init())
        if (options.swipe) this.swipeHandlers.forEach(h => h.init())
    }

    private tick = (): void => {
        if (this.pressed.has('left')) this.options.onX?.(-this.options.keyboard!.speed!)
        if (this.pressed.has('right')) this.options.onX?.(this.options.keyboard!.speed!)
        if (this.pressed.has('up')) this.options.onY?.(-this.options.keyboard!.speed!)
        if (this.pressed.has('down')) this.options.onY?.(this.options.keyboard!.speed!)

        if (this.prevMousePos) {
            const diffX = this.mousePos.x - this.prevMousePos.x
            const diffY = this.mousePos.y - this.prevMousePos.y
            if (Math.abs(diffX) >= this.options.dragAndDrop!.treshold!) this.mousePosTreshold.x = false
            if (Math.abs(diffY) >= this.options.dragAndDrop!.treshold!) this.mousePosTreshold.y = false
            
            if (!this.mousePosTreshold.x) {
                this.prevMousePos.x = this.mousePos.x
                this.options.onX?.(-diffX * this.options.dragAndDrop!.speed!)
            }

            if (!this.mousePosTreshold.y) {
                this.prevMousePos.y = this.mousePos.y
                this.options.onY?.(-diffY * this.options.dragAndDrop!.speed!)
            }
        }
    }

    public release(): void {
        clearInterval(this.interval)
        this.eventHandlers.forEach(h => h.init())
        if (this.options.keyboard) this.keyEventHandlers.forEach(h => h.release())
        if (this.options.dragAndDrop) this.dragAndDropHandlers.forEach(h => h.release())
        if (this.options.swipe) this.swipeHandlers.forEach(h => h.release())
    }
 
}

export default ShiftManager