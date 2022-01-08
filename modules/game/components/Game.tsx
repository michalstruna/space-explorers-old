import React from 'react'
import Http from '../../async/lib/Http'

import Game from '../lib/Game'
import { GameData, GameOptions, LocalGameOptions } from '../types'

import styles from './Game.module.scss'

interface Props extends Partial<Omit<LocalGameOptions, 'container'>> {

}

const Map: React.FC<Props> = ({ 
    nStars = 100
}) => {
    const container = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        let game: Game | null = null

        const gameOptions: GameOptions = {
            nStars,
            players: [
                { name: 'Michal', color: 0x00aaff }
            ]
        }

        Http.post<GameData>('games', gameOptions).then(gameData => {
            game = new Game(container.current!, gameData)
        })

        return () => {
            game?.release()
        }
    }, [])

    return (
        <div ref={container} className={styles.root}>
            
        </div>
    )
}

export default Map