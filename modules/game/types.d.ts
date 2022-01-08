import { MutableRefObject, ProviderExoticComponent, RefObject } from 'react'
import * as Pixi from 'pixi.js'
import Player from './lib/Player'

export interface LocalGameOptions {
    container: HTMLElement
    nStars: number
}

export interface PlayerOptions {
    name: string
    color: number
}

export interface GameOptions {
    nStars: number
    players: PlayerOptions[]
}

export interface GameData {
    created: number
    players: PlayerData[]
    stars: StarData[]
    size: Point
}

export interface Point {
    x: number
    y: number
}

export interface Unique {
    get id(): string
}

export interface UniqueData {
    id: string
}

export interface GameObjectData extends UniqueData {
    name: string
    position: Point
    owner: Player | null
}

export interface StarData extends GameObjectData {
    harvard: string
    yerkes: string
}

export interface StarsArea {
    stars: StarData[]
    size: {
        x: number
        y: number
    }
}

export interface PlayerData {
    id: string
    name: string
    color: number
    stars: []
    ships: []
}
