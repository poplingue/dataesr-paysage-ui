import { Button, Row } from '@dataesr/react-dsfr';
import useCSSProperty from '../../hooks/useCSSProperty';
import styles from './ShowMoreList.module.scss';

export default function ShowMoreList({ children }) {
    const { style: grey } = useCSSProperty('--grey-main-525');
    const { style: white } = useCSSProperty('--grey-1000');

    return (
        <>
            <Button
                className={styles.ShowMore}
                size="sm"
                icon="ri-add-line"
                secondary
                iconPosition="right"
                colors={[grey, white]}
            >
                Voir plus
            </Button>
            <Button
                colors={[grey, white]}
                className={styles.ShowLess}
                icon="ri-subtract-line"
                size="sm"
                iconPosition="right"
                secondary
            >
                Voir moins
            </Button>
            <Row gutters className={styles.Panel}>
                {children}
            </Row>
        </>
    );
}
