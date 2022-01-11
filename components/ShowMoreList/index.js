import { useState } from 'react';
import grid from '../../helpers/imports';
import useCSSProperty from '../../hooks/useCSSProperty';
import FieldButton from '../FieldButton';
import styles from './ShowMoreList.module.scss';

export default function ShowMoreList({ children }) {
    const { Row } = grid();

    const { style: grey } = useCSSProperty('--grey-main-525');
    const { style: white } = useCSSProperty('--grey-1000');
    const [active, setActive] = useState(false);
    const activeObj = {
        true: {
            myClass: styles.ShowLess,
            icon: 'ri-subtract-line',
            text: 'Voir moins',
        },
        false: {
            myClass: styles.ShowMore,
            icon: 'ri-add-line',
            text: 'Voir plus',
        },
    };

    return (
        <>
            <FieldButton
                onClick={() => setActive(!active)}
                className={activeObj[active].myClass}
                size="sm"
                icon={activeObj[active].icon}
                secondary
                iconPosition="right"
                colors={[grey, white]}
                title={activeObj[active].text}
            />
            <Row gutters className={styles.Panel}>
                {children}
            </Row>
        </>
    );
}
