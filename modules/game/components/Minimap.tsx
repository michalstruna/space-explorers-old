import React from 'react'

import styles from './Game.module.scss'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Minimap: React.FC<Props> = ({ ...props }) => {

    return (
        <div className={styles.ui__minimap} {...props}>
            
        </div>
    )
}

export default Minimap