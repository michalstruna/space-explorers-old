import { MutableRefObject, ProviderExoticComponent, RefObject } from 'react'
import * as Pixi from 'pixi.js'
import Player from './lib/Player'

export type GameOptions = {
    container?: HTMLElement
    backgroundColor?: number
    nStars?: number
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
}