import React from 'react'

import styles from './ui.module.scss'

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
    icon: string
    value: number
    text?: string
    onChange?: (value: number) => void
    max?: number
}

const Stack: React.FC<Props> = ({ icon, value, text, onChange, max, ...props }) => {

    const handleUpdate = (value: number) => {
        onChange?.(Math.max(0, Math.min(value, max || Infinity)))
    }

    const items = React.useMemo(() => {
        const result: React.ReactElement[] = []
        const maxWidth = `${100 / value}%`

        for (let i = 0; i < value; i++) {
            result.push(
                <div className={styles.stack__item} style={{ maxWidth }} key={i}>
                    <div className={styles['stack__item--inner']} style={{ backgroundImage: `url(${icon})` }} />
                </div>
            )
        }

        return result
    }, [value])

    return (
        <div className={styles.stack} {...props}>
            <div className={styles.stack__main}>
                <button
                    className={`${styles.stack__button} ${styles['stack__button--remove']}`}
                    disabled={value === 0}
                    onClick={() => handleUpdate(value - 1)} />
                <div className={styles.stack__items} style={{ gridTemplateColumns: `repeat(${value}, ${100 / value}%)` }}>
                    {items}
                </div>
                <button
                    className={`${styles.stack__button} ${styles['stack__button--add']}`}
                    disabled={value === max}
                    onClick={() => handleUpdate(value + 1)} />
            </div>
            {text && <div className={styles.stack__info}>
                {text}
            </div>}
        </div>
    )
}

export default Stack