import React from 'react'

import styles from './ui.module.scss'
import { format, formatShort } from '../lib/Numbers'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    name: string
    icon: string
    value: number
    maxValue: number
}

const Value: React.FC<Props> = ({ name, icon, value, maxValue, ...props }) => {

    return (
        <div className={styles.value} style={{ backgroundImage: `url("/${icon}")` }} {...props}>
            <div className={styles.value__label}>
                {name}
            </div>
            <div className={styles.value__main}>
                <div className={styles.value__current}>{value}</div>
                {maxValue !== undefined ?  (
                    <>
                        <div className={styles.value__max}>{formatShort(maxValue)}</div>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export default Value