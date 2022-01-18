import Player from './Player'

interface TurnOptions {
    players: Player[]
    onChange?: (player: Player, turn: number) => void
    start?: number
}

class Turn {

    private players: Player[]
    private _index: number
    private _player: Player
    private handleChange?: (player: Player, turn: number) => void
    private _isInitialized = false

    public constructor(options: TurnOptions) {
        this._index = this._player = null as any
        this.players = options.players
        this.index = options.start || 0
        this.handleChange = options.onChange

        setTimeout(() => {
            this.handleChange?.(this.player, this.index)
            this._isInitialized = true
        })
    }

    public next() {
        this.index++
    }

    public get index(): number {
        return this._index
    }

    public get player(): Player {
        return this._player
    }

    public get isInitialized() {
        return this._isInitialized
    }

    private set index(index: number) {
        this._index = index
        this._player = this.players[this.index % this.players.length]
        this.handleChange?.(this.player, this.index)
    }

}

export default Turn