import { Col } from '@dataesr/react-dsfr';
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
    const { style: red } = useCSSProperty('--error');

    return (
        display && (
            <Col n="2" className="txt-right">
                <FieldButton
                    colors={[red, '#fff']}
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
