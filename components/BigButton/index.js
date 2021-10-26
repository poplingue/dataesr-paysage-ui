import { Button, Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import styles from './BigButton.module.scss';

export default function BigButton({ onClick, title, icon, color, square }) {
    return (
        <div className={`${styles.Button} ${square ? styles.Square : ''}`}>
            <Button
                onClick={onClick}
                title={title}
                colors={[color, '#fff']}
                secondary
            >
                <div>
                    <Icon
                        verticalAlign={!square}
                        color={color}
                        name={icon}
                        size="lg"
                        className={styles.Icon}
                        as={square ? 'div' : 'span'}
                    >
                        <>{title}</>
                    </Icon>
                </div>
            </Button>
        </div>
    );
}

BigButton.defaultProps = {
    color: '000091',
    square: true,
};
BigButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    square: PropTypes.bool,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string,
};
