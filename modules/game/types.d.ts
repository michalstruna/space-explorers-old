import { MutableRefObject, ProviderExoticComponent, RefObject } from 'react'
import * as Pixi from 'pixi.js'
import Player from './lib/Player'
import Star from './lib/Star'
import EventManager from './lib/EventManager'

export interface LocalGameOptions {
    container: HTMLElement
    nStars: number
}

export interface GameOptions {
    nStars: number
    players: PlayerOptions[]
}

export interface GameData<Populated = false> {
    created: number
    players: PlayerData[]
    stars: StarData[]
    size: Point
    container: Populated extends true ? HTMLElement : undefined
    events: Populated extends true ? EventManager : undefined
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
    events: Populated extends true ? EventManager : undefined
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

export interface ShipComponent {
    name: string
    speed: number
    cargo: number
    mass: number
}

export interface ShipData<Populated = false> extends GameObjectData<Populated> {
    
}