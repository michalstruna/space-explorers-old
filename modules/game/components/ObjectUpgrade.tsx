import React from 'react'
import Value from '../../utils/components/Value'
import Building from '../lib/buildings/Building'

import styles from './ObjectUpgrade.module.scss'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    object: Building
}

const ObjectProps: React.FC<Props> = ({ object, ...props }) => {

    const [isHover, setHover] = React.useState(false)

    return (
        <div className={styles.root} {...props}>
            <div className={styles.main}>
                <div className={styles.image} style={{ backgroundImage: 'url("https://inhabitat.com/wp-content/blogs.dir/1/files/2012/04/london-olympic-medal-metal-manufacturer-rio-tinto-accused-of-pollution-ill-treatment-2-537x357.jpg")' }} />

                <div className={styles.content}>
                    <h3 className={styles.name}>{object.name.toLocaleLowerCase()}</h3> (lv. {object.level} {isHover ? <Value value={1} sign={true} /> : null})
                    <br />
                    Kapacita  <Value value={9871} /> {isHover ? <Value value={2132} sign={true} /> : null}
                    <br />
                    Výkon <Value value={3214} /> {isHover ? <Value value={213} sign={true} /> : null}
                </div>
            </div>

            <div className={styles.upgrade}>
                    <div className={styles.upgrade__resources}>
                        <Value icon='icons/metal.svg' value={100} maximum={50} />
                        <Value icon='icons/crystal.svg' value={100} />
                        <Value icon='icons/hours.svg' value={4} />
                    </div>

                    <button className={styles.upgrade__button} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} />
                </div>
        </div>
    )
}

export default ObjectProps