import React from 'react'

import Http from '../../async/lib/Http'
import Game from '../lib/Game'
import { GameData, GameOptions, LocalGameOptions } from '../types'
import { useGlobalState } from '../data/GlobalState'
import styles from './Game.module.scss'
import Tab from './Tab'
import Minimap from './Minimap'
import Events from '../lib/Events'

interface Props extends Partial<Omit<LocalGameOptions, 'container'>>, React.ComponentPropsWithoutRef<'div'> {

}

const Map: React.FC<Props> = ({ 
    nStars = 100,
    ...props
}) => {
    const container = React.useRef<HTMLDivElement>(null)
    const [, selectObject] = useGlobalState('selectedObject')
    const [lastUpdate, setLastUpdate] = useGlobalState('lastUpdate')

    React.useEffect(() => {
        const events = new Events()

        events.on('click', ({ object }) => {
            selectObject(object)
        })

        events.on('update', ({ object }) => {
            setLastUpdate(Date.now())
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
            <div className={styles.ui} key={lastUpdate}>
                <div className={styles.ui__right}>
                    <Minimap />
                </div>
                <Tab />
            </div>
        </div>
    )
}

export default Map