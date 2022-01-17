import React from 'react'
import Stack from '../../utils/components/Stack'
import Value from '../../utils/components/Value'

import Star from '../lib/Star'

import styles from './ObjectMenu.module.scss'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    star: Star
}

const StarMenu: React.FC<Props> = ({ star, ...props }) => {

    return (
        <div className={styles.root} {...props}>
            Owner: Michal<br />

            <div className={styles.row}>
                <Value icon='icons/population.svg' name='Population' value={37} maxValue={100} />
                <Value icon='icons/building.svg' name='Buildings' value={37} maxValue={100} />
            </div>

            <div className={styles.row}>
                <Value icon='icons/metal.svg' name='Metals' value={123} maxValue={10000} />
                <Value icon='icons/crystal.svg' name='Crystals' value={123} maxValue={10000} />
            </div>

            <Stack icon='icons/farmer.svg' value={50} text={`Farmers: 50/53 • Max. population: 100`} />
            <Stack icon='icons/worker.svg' value={20} text={`Workers: 50/53 • Efficiency: +25 %`} />
            <Stack icon='icons/scientist.svg' value={5} text={`Scientists: 50/53`} />
        </div>
    )
}

export default StarMenu