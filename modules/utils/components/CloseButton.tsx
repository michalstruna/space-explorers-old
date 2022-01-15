import React from 'react'

import styles from './ui.module.scss'

interface Props extends React.ComponentPropsWithoutRef<'button'> {

}

const CloseButton: React.FC<Props> = ({ ...props }) => {

    return (
        <button className={styles['close-button']} {...props} />
    )
}

export default CloseButton