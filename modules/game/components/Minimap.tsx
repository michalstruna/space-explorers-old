import React from 'react'

import styles from './Minimap.module.scss'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Minimap: React.FC<Props> = ({ ...props }) => {

    return (
        <div className={styles.root} {...props}>
            
        </div>
    )
}

export default Minimap