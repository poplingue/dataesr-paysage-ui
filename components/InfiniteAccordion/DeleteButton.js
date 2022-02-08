import PropTypes from 'prop-types';
import grid from '../../helpers/imports';
import { cleanString } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import FieldButton from '../FieldButton';

export default function DeleteButton({
    display,
    title,
    index,
    background,
    onClick,
}) {
    const { Col } = grid();

    const { style: red } = useCSSProperty('--error-main-525');
    const { style: white } = useCSSProperty('--grey-1000');

    return (
        display && (
            <Col n="2" className="txt-right">
                <FieldButton
                    colors={[red, background || white]}
                    dataTestId={`btn-delete-${cleanString(title)}${
                        index ? `#${index}` : ''
                    }`}
                    onClick={onClick}
                    title="Supprimer"
                />
            </Col>
        )
    );
}

DeleteButton.defaultProps = {
    display: true,
    title: '',
    background: '',
};

DeleteButton.propTypes = {
    display: PropTypes.bool,
    title: PropTypes.string,
    index: PropTypes.number,
    background: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};
