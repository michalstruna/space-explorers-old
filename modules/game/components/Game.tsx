import React from 'react'
import EventEmitter from 'eventemitter3'

import Http from '../../async/lib/Http'
import Game from '../lib/Game'
import { GameData, GameOptions, LocalGameOptions } from '../types'

import styles from './Game.module.scss'
import Sidebar from './Sidebar'
import Minimap from './Minimap'
import GameObject from '../lib/GameObject'

interface Props extends Partial<Omit<LocalGameOptions, 'container'>>, React.ComponentPropsWithoutRef<'div'> {

}

const Map: React.FC<Props> = ({ 
    nStars = 100,
    ...props
}) => {
    const container = React.useRef<HTMLDivElement>(null)
    const [selectedObject, selectObject] = React.useState<GameObject>()

    React.useEffect(() => {
        const events = new EventEmitter()

        events.on('click', ({ object }) => {
            selectObject(object)
        })

        let game: Game | null = null

        const gameOptions: GameOptions = {
            nStars,
            players: [
                { name: 'Michal', color: 0x00aaff },
                { name: 'Lenka', color: 0xaa00ff },
                { name: 'Radka', color: 0x55aa55 }
            ]
        }

        Http.post<GameData>('games', gameOptions).then(gameData => {
            game = new Game({ ...gameData, container: container.current!, events })
        })

        return () => {
            game?.release()
        }
    }, [])

    return (
        <div className={styles.root} {...props}>
            <div ref={container} className={styles.canvas} />
            <div className={styles.ui}>
                <Minimap />
                <Sidebar object={selectedObject} />
            </div>
        </div>
    )
}

export default Map