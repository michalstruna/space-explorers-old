import React from 'react'

import styles from './Sidebar.module.scss'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Sidebar: React.FC<Props> = ({ ...props }) => {

    return (
        <div className={styles.root} {...props}>
            
        </div>
    )
}

export default Sidebar