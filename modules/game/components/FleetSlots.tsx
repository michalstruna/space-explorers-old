import ClassNames from 'classnames'
import React from 'react'

import Ship from '../lib/ships/Ship'
import styles from './ObjectMenu.module.scss'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    ships: Ship[]
    size: number
    defence?: Ship[]
    defenceSize?: number
}

interface SlotProps extends React.ComponentPropsWithoutRef<'div'> {

}

const Slot: React.FC<SlotProps> = ({  }) => {

    return (
        <div className={styles.fleet__slot}>

        </div>
    )

}

const backIndexes = [9, 7, 5, 6, 8]
const frontIndexes = [4, 2, 0, 1, 3]
const defenceIndexes = frontIndexes

const FleetSlots: React.FC<Props> = ({ ships, size, defence, defenceSize, ...props }) => {

    return (
        <div className={styles.fleet} {...props}>
            <div className={ClassNames(styles.fleet__slots, styles['fleet__slots--defence'])}>
                {new Array(defenceSize).fill(null).map((_, i) => (!defenceSize || defenceIndexes[i] < defenceSize) && <Slot key={i} />)}
            </div>
            <div className={styles.fleet__slots}>
                {new Array(size).fill(null).map((_, i) => backIndexes[i] < size && <Slot key={i} />)}
            </div>
            <div className={styles.fleet__slots}>
                {new Array(size).fill(null).map((_, i) => frontIndexes[i] < size && <Slot key={i} />)}
            </div>
        </div>
    )
}

export default FleetSlots