import React from 'react'
import ClassNames from 'classnames'

import Stack from '../../utils/components/Stack'
import ObjectTile from './ObjectTile'
import Value from '../../utils/components/Value'
import Star from '../lib/Star'

import styles from './ObjectView.module.scss'
import FleetSlots from './FleetSlots'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    star: Star
}

const StarView: React.FC<Props> = ({ star, ...props }) => {

    const free = star.population - star.farmers - star.workers - star.scientists

    return (
        <div className={styles.root} {...props}>

            <div className={styles.row}>
                <Value icon='/icons/population.svg' name='Population' value={star.population} maxValue={star.maxPopulation} />
                <Value icon='/icons/metal.svg' name='Metals' value={123} maxValue={10000} />
                <Value icon='/icons/crystal.svg' name='Crystals' value={123} maxValue={10000} />
            </div>

            <div className={styles.section__separator} />

            <div className={ClassNames(styles.row, styles['row--fixed'])}>
                <div>
                    <Value icon='/icons/population.svg' name='Population' className={styles.section__title} />
                    <Stack icon='/icons/farmer.svg' value={star.farmers} text={`Farmers: ${star.farmers}/${star.farmers + free} • Max. population: ${star.farmers * 3}`} onChange={f => star.farmers = f} max={star.farmers + free} />
                    <Stack icon='/icons/worker.svg' value={star.workers} text={`Workers: ${star.workers}/${star.workers + free} • Efficiency: +${star.workers * 10} %`} onChange={w => star.workers = w} max={star.workers + free} />
                    <Stack icon='/icons/scientist.svg' value={star.scientists} text={`Scientists: ${star.scientists}/${star.scientists + free}`} onChange={s => star.scientists = s} max={star.scientists + free} />
                </div>
                <div>
                    <Value icon='/icons/fleet.svg' name='Flotila' className={styles.section__title} />
                    <FleetSlots ships={[]} size={5} defenceSize={3} />
                </div>
            </div>

            <div className={styles.section__separator} />

            <Value icon='/icons/building.svg' name='Budovy' className={styles.section__title} />

            <div className={styles.upgrades}>
                {[...star.buildings.toArray(), ...star.buildings.toArray(), ...star.buildings.toArray(), ...star.buildings.toArray(), ...star.buildings.toArray()].map((b, i) => <ObjectTile key={i} object={b} />)}
            </div>

        </div>
    )
}

export default StarView