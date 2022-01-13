import React from 'react'

import Star from '../lib/Star'

import styles from './StarMenu.module.scss'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    star: Star
}

const StarMenu: React.FC<Props> = ({ star, ...props }) => {

    return (
        <div className={styles.root} {...props}>
            {star.name}
        </div>
    )
}

export default StarMenu