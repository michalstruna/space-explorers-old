import { createGlobalState } from 'react-hooks-global-state'
import GameObject from '../lib/GameObject'

const defaultState = {
    selectedObject: null as GameObject | null,
    lastUpdate: 0
}

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(defaultState)

export { useGlobalState, setGlobalState, getGlobalState }