import React from 'react'

import Game from '../lib/Game'
import { GameOptions } from '../types'

import styles from './Map.module.scss'

interface Props extends Partial<Omit<GameOptions, 'container'>> {

}

const Map: React.FC<Props> = ({ 
    sizeX = 5000,
    sizeY = 4000
}) => {
    const container = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const game = new Game({
            sizeX,
            sizeY,
            container,
            backgroundColor: 0x212121
        })

        return () => {
            game.end()
        }
    }, [])

    return (
        <div ref={container} className={styles.root}>
            
        </div>
    )
}

export default Map