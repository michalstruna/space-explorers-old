import React from 'react'
import ClassNames from 'classnames'
import { usePopperTooltip } from 'react-popper-tooltip'

import styles from './ui.module.scss'


interface Props extends React.ComponentPropsWithoutRef<'div'> {
    trigger: React.ReactElement
}

const Tooltip: React.FC<Props> = ({ trigger, children, ...props }) => {

    const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip()

    return (
        <>
            {React.cloneElement(trigger, { ref: setTriggerRef })}
            {visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: ClassNames('tooltip-container', styles.tooltip) })}>
                    <div {...getArrowProps({ className: ClassNames('tooltip-arrow', styles.tooltip__arrow) })} />
                    {children}
                </div>
            )}
        </>
    )
}

export default Tooltip