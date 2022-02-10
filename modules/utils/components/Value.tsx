import React from 'react'
import ClassNames from 'classnames'

import styles from './ui.module.scss'
import { format, formatShort } from '../lib/Numbers'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    value?: number
    icon?: string
    name?: React.ReactNode
    tooltip?: string | boolean
    short?: boolean
    sign?: boolean
    maxValue?: number
    minimum?: number
    maximum?: number
}

const Value: React.FC<Props> = ({ value, icon, name, tooltip, short, sign, maxValue, minimum, maximum, className, ...props }) => {

    const formatter = short ? formatShort : format

    return (
        <div
            className={ClassNames(className, styles.value, { [styles.value__icon]: icon })}
            style={icon ? { backgroundImage: `url(${icon})` } : undefined}
            {...props}>
            {name && <>
                <div className={styles.value__name}>
                    {name}
                </div>
                <br />
            </>}
            {value !== undefined && (
                <div className={styles.value__main}>
                    <div className={ClassNames(styles.value__current, {
                        [styles['value__current--positive']]: sign && value > 0,
                        [styles['value__current--negative']]: sign && value < 0,
                        [styles['value__current--zero']]: sign && !value,
                        [styles['value__current--invalid']]: (minimum !== undefined && value < minimum) || (maximum !== undefined && value > maximum)
                    })}>
                    {sign && value >= 0 ? '+' : ''}{formatter(value)}
                    </div>
                    {maxValue && (
                        <div className={styles.value__max}>
                            {formatShort(maxValue)}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Value