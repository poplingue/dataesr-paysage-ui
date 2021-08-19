import { Col, Container, Row } from '@dataesr/react-dsfr';
import { Children, cloneElement, useRef } from 'react';
import { cleanString } from '../../helpers/utils';
import FieldButton from '../FieldButton';

export default function Field({ title, label, index, parentsection, deleteField, children, value }) {
    // TODO do it with useRef??
    const ref = useRef(null);

    const deleteCurrentField = () => {
        deleteField(ref.current);
    };

    return <Container fluid>
        <Row alignItems="middle" gutters>
            <Col n="8">
                {Children.toArray(children).map((child, i) => {
                    const field = cloneElement(child, {
                        title,
                        label,
                        value,
                        parentsection,
                        keynumber: index,
                    });

                    return <div key={i} ref={ref}>
                        {field}
                        <Col n="4">
                            {index > 0 && <FieldButton
                                datatestid={`btn-delete-${cleanString(label)}`}
                                title={`Delete ${label}`}
                                onClick={deleteCurrentField}/>}
                        </Col>
                    </div>;
                })}
            </Col>
        </Row>
    </Container>;
}
