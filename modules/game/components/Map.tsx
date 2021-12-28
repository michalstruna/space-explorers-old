import React from 'react'

import Game from '../lib/Game'
import { GameOptions } from '../types'

import styles from './Map.module.scss'

interface Props extends Partial<Omit<GameOptions, 'container'>> {

}

const Map: React.FC<Props> = ({ 
    nStars = 500
}) => {
    const container = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const game = new Game({
            nStars,
            container: container.current!
        })

        return () => {
            game.release()
        }
    }, [])

    return (
        <div ref={container} className={styles.root}>
            
        </div>
    )
}

export default Map