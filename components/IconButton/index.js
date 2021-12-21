import { Button, Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import styles from './IconButton.module.scss';

export default function IconButton({
    onClick,
    title,
    icon,
    color,
    square,
    size,
}) {
    return (
        <div className={`${styles.Button} ${square ? styles.Square : ''}`}>
            <Button
                onClick={onClick}
                title={title}
                colors={[color, '#fff']}
                secondary
                size={size === 'medium' && 'sm'}
                className={size === 'medium' && styles.Medium}
            >
                <div>
                    <Icon
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

IconButton.defaultProps = {
    color: '000091',
    size: 'large',
    square: true,
};
IconButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    square: PropTypes.bool,
    title: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['large', 'medium']),
    icon: PropTypes.string.isRequired,
    color: PropTypes.string,
};
