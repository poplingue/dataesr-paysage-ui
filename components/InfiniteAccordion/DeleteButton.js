import { Col } from '@dataesr/react-dsfr';
import { cleanString } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import FieldButton from '../FieldButton';

export default function DeleteButton({ display, title, index, onclick }) {
    const { style: danger } = useCSSProperty('--error');

    return (
        display && (
            <Col n="2">
                <FieldButton
                    colors={[danger, '#fff']}
                    dataTestId={`btn-delete-${cleanString(title)}#${index}`}
                    onClick={onclick}
                    title="Supprimer"
                />
            </Col>
        )
    );
}
