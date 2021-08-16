import { Col, Container, Row } from '@dataesr/react-dsfr';
import { Children, cloneElement } from 'react';
import FieldButton from '../FieldButton';

export default function Index({ title, label, index, parentsection, deleteField, children, value }) {
    // TODO do it with useRef??
    return <Container fluid>
        <Row alignItems="middle" gutters>
            <Col n="8">
                {Children.toArray(children).map(
                    (child) => {
                        return cloneElement(child, {
                            title,
                            label,
                            value,
                            parentsection,
                            keynumber: index
                        });
                    },
                )}
            </Col>
            {index > 0 && <Col n="4">
                <FieldButton dataTestId='btn-remove' title={`Remove ${label}`} onClick={() => deleteField(index)}/>
            </Col>}
        </Row>
    </Container>;
}
