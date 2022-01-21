import { Callout, CalloutText, CalloutTitle } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

export default function CalloutCustom({ title, description, colorFamily }) {
    return (
        <Callout hasInfoIcon={false} colorFamily={colorFamily}>
            <CalloutTitle>{title}</CalloutTitle>
            <CalloutText size="md">{description}</CalloutText>
        </Callout>
    );
}

CalloutCustom.defaultProps = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    colorFamily: PropTypes.string.isRequired,
};
