import React from 'react'
import Tooltip from '../../utils/components/Tooltip'
import Value from '../../utils/components/Value'
import Building from '../lib/buildings/Building'
import Turn from '../lib/Turn'

import styles from './ObjectTile.module.scss'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    object: Building
}

const ObjectProps: React.FC<Props> = ({ object, ...props }) => {

    const turn = null as any // TODO

    return (
        <div className={styles.root} {...props}>
            <div className={styles.main}>
                <div className={styles.image} style={{ backgroundImage: `url("${object.renderPreview(turn)}")` }} />

                <div className={styles.content}>
                    <div className={styles.name__container}>
                        <h3 className={styles.name}>{object.name.toLocaleLowerCase()}</h3> (lv. {object.level})
                    </div>
                    Kapacita <Value value={9871} /><br />
                    Výkon <Value value={3214} />
                </div>
            </div>

            <Tooltip trigger={<button className={styles.upgrade} />}>
                <div className={styles.main}>
                    <div className={styles.image} style={{ backgroundImage: `url("${object.renderPreview(turn)}")` }} />

                    <div className={styles.content}>
                        <div className={styles.name__container}>
                            <h3 className={styles.name}>{object.name.toLocaleLowerCase()}</h3> (lv. {object.level} <Value value={1} sign={true} />)
                        </div>
                        Kapacita <Value value={9871} /> <Value value={2132} sign={true} /><br />
                        Výkon <Value value={3214} /> <Value value={213} sign={true} />
                    </div>
                </div>




                <hr />
                <div className={styles.resources}>
                    <Value icon='icons/metal.svg' value={12200} maximum={50} /> <Value icon='icons/crystal.svg' value={1200} /> <Value icon='icons/hours.svg' value={40} />
                </div>
            </Tooltip>


        </div>
    )
}

export default ObjectProps