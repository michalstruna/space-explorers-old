import React from 'react'
import Stack from '../../utils/components/Stack'
import ObjectUpgrade from './ObjectUpgrade'
import Value from '../../utils/components/Value'
import Star from '../lib/Star'

import styles from './ObjectMenu.module.scss'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    star: Star
}

const StarMenu: React.FC<Props> = ({ star, ...props }) => {

    const free = star.population - star.farmers - star.workers - star.scientists

    return (
        <div className={styles.root} {...props}>

            <div className={styles.row}>
                <Value icon='icons/population.svg' name='Population' value={star.population} maxValue={star.maxPopulation} />
                <Value icon='icons/building.svg' name='Buildings' value={37} maxValue={100} />
                <Value icon='icons/metal.svg' name='Metals' value={123} maxValue={10000} />
                <Value icon='icons/crystal.svg' name='Crystals' value={123} maxValue={10000} />
            </div>

            <h2 className={styles.section__title}>
                Population
            </h2>

            <div className={styles.row}>
                <div>
                    <Stack icon='icons/farmer.svg' value={star.farmers} text={`Farmers: ${star.farmers}/${star.farmers + free} • Max. population: 100`} onChange={f => star.farmers = f} max={star.farmers + free} />
                    <Stack icon='icons/worker.svg' value={star.workers} text={`Workers: ${star.workers}/${star.workers + free} • Efficiency: +25 %`} onChange={w => star.workers = w} max={star.workers + free} />
                    <Stack icon='icons/scientist.svg' value={star.scientists} text={`Scientists: ${star.scientists}/${star.scientists + free}`} onChange={s => star.scientists = s} max={star.scientists + free} />
                </div>
                <div />
            </div>

            <h2 className={styles.section__title}>
                Buildings
            </h2>

            <div className={styles.upgrades}>
                {[...star.buildings.toArray(), ...star.buildings.toArray(), ...star.buildings.toArray(), ...star.buildings.toArray(), ...star.buildings.toArray()].map((b, i) => <ObjectUpgrade key={i} object={b} />)}
            </div>

        </div>
    )
}

export default StarMenu