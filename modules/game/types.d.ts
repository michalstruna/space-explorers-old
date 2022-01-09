import { MutableRefObject, ProviderExoticComponent, RefObject } from 'react'
import * as Pixi from 'pixi.js'
import Player from './lib/Player'
import Star from './lib/Star'

export interface LocalGameOptions {
    container: HTMLElement
    nStars: number
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







export interface GameObjectData<Populated = false> extends UniqueData {
    name: string
    position: Point
    owner: (Populated extends true ? Player : string) | null
}

export interface StarData<Populated = false> extends GameObjectData<Populated> {
    harvard: string
    yerkes: string
}

export interface PlayerOptions {
    name: string
    color: number
}

export interface PlayerData<Populated = false> {
    id: string
    name: string
    color: number
    stars: (Populated extends true ? Star : string)[]
    ships: string[] // TODO: Populated.
}
