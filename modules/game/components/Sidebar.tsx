import React from 'react'

import styles from './Sidebar.module.scss'
import StarMenu from './StarMenu'
import Star from '../lib/Star'
import { useGlobalState } from '../data/GlobalState'
import CloseButton from '../../utils/components/CloseButton'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Sidebar: React.FC<Props> = ({ ...props }) => {

    const [selectedObject, selectObject] = useGlobalState('selectedObject')

    return (
        <div className={styles.root} {...props}>
            {selectedObject ? (
                <>
                    <header className={styles.header}>
                        <h2 className={styles.title}>{selectedObject.name}</h2>
                        <CloseButton onClick={() => selectObject(null)} />
                    </header>
                    {selectedObject instanceof Star ? <StarMenu star={selectedObject} /> : null}
                </>
            ) : null}
        </div>
    )
}

export default Sidebar