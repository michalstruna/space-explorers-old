import { MutableRefObject, RefObject } from 'react'

export type GameOptions = {
    sizeX: number
    sizeY: number
    container: RefObject<HTMLDivElement>
    backgroundColor: number
}