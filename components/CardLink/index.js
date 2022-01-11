import {
    Card,
    CardDescription,
    CardDetail,
    CardTitle,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import NavLink from '../NavLink';
import styles from './CardLink.module.scss';

export default function CardLink({ link, supInfo, info, subInfo, color }) {
    const myAsLink = link ? <NavLink href={link}>Structure</NavLink> : null;

    return (
        <Card
            asLink={myAsLink}
            hasArrow={!!link}
            className={`${styles.CardLink} ${styles[color]}`}
        >
            <CardDetail>{supInfo}</CardDetail>
            <CardTitle>{info}</CardTitle>
            <CardDescription>{subInfo}</CardDescription>
        </Card>
    );
}

CardLink.defaultProps = {
    color: '',
    supInfo: '',
};

CardLink.propTypes = {
    color: PropTypes.oneOf(['Yellow', 'Pink', '']),
    link: PropTypes.string.isRequired,
    supInfo: PropTypes.string,
    info: PropTypes.string.isRequired,
    subInfo: PropTypes.string,
};
