import KeyCode from 'keycode'

type Handler = (change: number) => void

type ShiftOptions = {
    keyboard?: boolean
    dragAndDrop?: boolean
    swipe?: boolean

    onX?: Handler
    onY?: Handler
    onResize?: () => void
}

class ShiftManager {

    private options: ShiftOptions
    private pressed: Set<string> = new Set()

    private handleKeyDown = (e: Event) => {
        this.pressed.add(KeyCode(e))
    }

    private handleKeyUp = (e: Event) => {
        this.pressed.delete(KeyCode(e))
    }

    private handleResize = () => {
        this.options.onResize?.()
    }

    private eventHandlerMap: [Window, string, (e: Event) => void][] = [
        [window, 'keydown', this.handleKeyDown],
        [window, 'keyup', this.handleKeyUp],
        [window, 'resize', this.handleResize]
    ]

    public constructor(options: ShiftOptions) {
        this.options = options

        this.eventHandlerMap.forEach(([container, event, handler]) => {
            container.addEventListener(event, handler)
        })
    }

    public tick(): void {
        if (this.pressed.has('left')) this.options.onX?.(-1)
        if (this.pressed.has('right')) this.options.onX?.(1)
        if (this.pressed.has('up')) this.options.onY?.(-1)
        if (this.pressed.has('down')) this.options.onY?.(1)
    }

    public release(): void {
        this.eventHandlerMap.forEach(([container, event, handler]) => {
            container.removeEventListener(event, handler)
        })
    }
 
}

export default ShiftManager