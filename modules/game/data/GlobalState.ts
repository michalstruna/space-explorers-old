import { createGlobalState } from 'react-hooks-global-state'
import Game from '../lib/Game'
import GameObject from '../lib/GameObject'

const defaultState = {
    selectedObject: null as GameObject | null,
    lastUpdate: 0,
    game: null as Game | null
}

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(defaultState)

export { useGlobalState, setGlobalState, getGlobalState }