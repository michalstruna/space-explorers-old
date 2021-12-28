import { MutableRefObject, RefObject } from 'react'

export type GameOptions = {
    container: HTMLElement
    backgroundColor: number
    nStars: number
}

export type StarData = {
    id: number
    name: string
    x: number
    y: number
    spect: string
    size: string
}

export type StarsArea = {
    stars: StarData[]
    size: {
        x: number
        y: number
    }
}