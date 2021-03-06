import PropTypes from 'prop-types';
import grid from '../../helpers/imports';
import { cleanString } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import FieldButton from '../FieldButton';

export default function DeleteButton({
    display,
    title,
    index,
    disabled,
    background,
    dataTestId,
    onClick,
}) {
    const { Col } = grid();

    const { style: red } = useCSSProperty('--error-main-525');
    const { style: white } = useCSSProperty('--grey-1000');

    const confirmBeforeClick = (e) => {
        if (confirm(`❗ Êtes-vous sûr·e ?`)) {
            onClick(e);
        }
    };

    return (
        display && (
            <Col>
                <FieldButton
                    title="Supprimer"
                    disabled={disabled}
                    colors={disabled ? [] : [red, background || white]}
                    onClick={confirmBeforeClick}
                    dataTestId={
                        dataTestId ||
                        `btn-delete-${cleanString(title)}${
                            index ? `#${index}` : ''
                        }`
                    }
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
