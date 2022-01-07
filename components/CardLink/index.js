import {
    Card,
    CardDescription,
    CardDetail,
    CardTitle,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import NavLink from '../NavLink';

export default function CardLink({ link, supInfo, info, subInfo }) {
    return (
        <Card asLink={<NavLink href={link}>Structure</NavLink>}>
            <CardDetail>{supInfo}</CardDetail>
            <CardTitle>{info}</CardTitle>
            <CardDescription>{subInfo}</CardDescription>
        </Card>
    );
}

CardLink.propTypes = {
    link: PropTypes.string.isRequired,
    supInfo: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    subInfo: PropTypes.string,
};
