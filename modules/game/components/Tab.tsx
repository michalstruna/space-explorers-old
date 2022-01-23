import React from 'react'

import styles from './Tab.module.scss'
import StarMenu from './StarMenu'
import Star from '../lib/Star'
import { useGlobalState } from '../data/GlobalState'
import CloseButton from '../../utils/components/CloseButton'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Tab: React.FC<Props> = ({ ...props }) => {

    const [selectedObject, selectObject] = useGlobalState('selectedObject')

    if (!selectedObject) return null

    return (
        <div className={styles.root} {...props}>
            <header className={styles.header}>
                <div>
                    <div className={styles.owner} style={{ color: '#' + (selectedObject.owner?.color.toString(16) ?? 'AAA') }}>{selectedObject.owner?.name ?? 'Barbars'}</div>
                    <h2 className={styles.title}>{selectedObject.name}</h2>
                </div>
                <CloseButton onClick={() => selectObject(null)} />
            </header>
            {selectedObject instanceof Star ? <StarMenu star={selectedObject} /> : null}
        </div>
    )
}

export default Tab