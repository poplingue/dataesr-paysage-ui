import { Callout, CalloutText, CalloutTitle } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

export default function CalloutPerson({ title, description }) {
    return (
        <Callout hasInfoIcon={false} colorFamily="pink-macaron">
            <CalloutTitle>{title}</CalloutTitle>
            <CalloutText>{description}</CalloutText>
        </Callout>
    );
}

CalloutPerson.defaultProps = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};
