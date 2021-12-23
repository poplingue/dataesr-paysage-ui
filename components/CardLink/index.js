import {
    Card,
    CardDescription,
    CardDetail,
    CardTitle,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import NavLink from '../NavLink';

export default function CardLink({ link, date, title, structure }) {
    return (
        <Card asLink={<NavLink href={link}>Structure</NavLink>}>
            <CardDetail>{date}</CardDetail>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{structure}</CardDescription>
        </Card>
    );
}

CardLink.propTypes = {
    link: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    structure: PropTypes.string.isRequired,
};
