import { useEffect } from 'react';
import { getCSSValue, setCSSProperty } from '../../helpers/utils';
import styles from './BorderPage.module.scss';

export default function BorderPage({color}) {

    useEffect(() => {
        const borderColor = getCSSValue('--border-page');

        if (color !== borderColor) {
            setCSSProperty('--border-page', color);
        }

    }, [color]);

    return <span className={styles.BorderPage}/>;
}
