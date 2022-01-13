import React from 'react'
import GameObject from '../lib/GameObject'
import Star from '../lib/Star'

import styles from './Sidebar.module.scss'
import StarMenu from './StarMenu'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    object?: GameObject
}

const Sidebar: React.FC<Props> = ({ object, ...props }) => {

    return (
        <div className={styles.root} {...props}>
            {object instanceof Star ? <StarMenu star={object} /> : null}
        </div>
    )
}

export default Sidebar