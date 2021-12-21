import { Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import NavLink from '../NavLink';
import styles from './LinkTo.module.scss';

export default function LinkTo({ href, text, icon }) {
    return (
        <div className={styles.LinkTo}>
            <NavLink href={href}>
                <Icon iconPosition="right" name={icon} size="lg">
                    <>{text}</>
                </Icon>
            </NavLink>
        </div>
    );
}

LinkTo.defaultProps = {
    icon: 'ri-arrow-right-line',
};

LinkTo.propTypes = {
    href: PropTypes.string.isRequired,
    icon: PropTypes.string,
    text: PropTypes.string.isRequired,
};
