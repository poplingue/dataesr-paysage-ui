import { Button, Row } from '@dataesr/react-dsfr';
import { useState } from 'react';
import useCSSProperty from '../../hooks/useCSSProperty';
import styles from './ShowMoreList.module.scss';

export default function ShowMoreList({ children }) {
    const { style: grey } = useCSSProperty('--grey-main-525');
    const { style: white } = useCSSProperty('--grey-1000');
    const [active, setActive] = useState(false);
    const activeObj = {
        true: {
            myCass: styles.ShowLess,
            icon: 'ri-subtract-line',
            text: 'Voir moins',
        },
        false: {
            myCass: styles.ShowMore,
            icon: 'ri-add-line',
            text: 'Voir plus',
        },
    };

    return (
        <>
            <Button
                onClick={() => setActive(!active)}
                className={activeObj[active].myCass}
                size="sm"
                icon={activeObj[active].icon}
                secondary
                iconPosition="right"
                colors={[grey, white]}
            >
                {activeObj[active].text}
            </Button>
            <Row gutters className={styles.Panel}>
                {children}
            </Row>
        </>
    );
}
