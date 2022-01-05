import { MutableRefObject, ProviderExoticComponent, RefObject } from 'react'
import * as Pixi from 'pixi.js'

export type GameOptions = {
    container?: HTMLElement
    backgroundColor?: number
    nStars?: number
}

export interface Point {
    x: number
    y: number
}

export interface StarData {
    id: number
    name: string
    position: Point
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

export interface Renderable {
    render(): Pixi.DisplayObject
    renderMini(): Pixi.DisplayObject
    renderLabel(): Pixi.Text
    get visibility(): number
}