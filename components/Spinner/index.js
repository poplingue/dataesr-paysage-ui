import { useContext, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import styles from './Spinner.module.scss';

export default function Spinner({ small = false, active = false, children }) {
    const {
        statePage: { spinner },
    } = useContext(AppContext);

    const [spinnerOn] = useState(spinner || active);

    // TODO add timer end to error notif
    return (
        <div
            className={`p-relative ${children ? 'd-inline-block' : ''} ${
                !spinnerOn && !active ? 'd-none' : ''
            }`}
        >
            <div className={`${small ? styles.Small : ''}`}>
                <div className={styles.Outside}>
                    <div className={styles.Inside} />
                    {children}
                </div>
            </div>
        </div>
    );
}
