import grid from '../../helpers/imports';
import { cleanString } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import FieldButton from '../FieldButton';

export default function DeleteButton({
    display,
    title,
    index,
    onclick,
    label = '',
}) {
    const { Col } = grid();

    const { style: red } = useCSSProperty('--error-main-525');
    const { style: white } = useCSSProperty('--grey-1000');

    return (
        display && (
            <Col n="2" className="txt-right">
                <FieldButton
                    colors={[red, white]}
                    dataTestId={`btn-delete-${cleanString(label || title)}${
                        index ? `#${index}` : ''
                    }`}
                    onClick={onclick}
                    title="Supprimer"
                />
            </Col>
        )
    );
}
