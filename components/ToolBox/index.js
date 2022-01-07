import { Icon, Text } from '@dataesr/react-dsfr';
import { useState } from 'react';
import styles from './ToolBox.module.scss';

export default function ToolBox({ children }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className={`${styles.ToolBox} ${open ? styles.Active : ''}`}
            data-cy="toolbox-header"
        >
            <div className={styles.Header} onClick={() => setOpen(!open)}>
                <Icon
                    name={`${open ? 'ri-arrow-right-s-line' : ''}`}
                    className={styles.Arrow}
                >
                    <Text
                        className={`${styles.HeaderTxt} ${
                            !open ? 'hidden' : ''
                        }`}
                    >
                        Outils
                    </Text>
                </Icon>
                <Icon
                    name="ri-tools-fill"
                    size="lg"
                    iconPosition="right"
                    className={`${styles.ToolIcon} ${
                        !open ? styles.Active : ''
                    }`}
                />
            </div>
            <div className={`${!open ? 'hidden' : ''}`}>{children}</div>
        </div>
    );
}
