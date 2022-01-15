import { createGlobalState } from 'react-hooks-global-state'
import GameObject from '../lib/GameObject'

const defaultState = {
    selectedObject: null as GameObject | null
}

const { useGlobalState } = createGlobalState(defaultState)

export { useGlobalState }