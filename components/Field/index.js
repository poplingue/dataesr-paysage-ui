import { Col, Container, Row } from '@dataesr/react-dsfr';
import { Children, cloneElement, useRef } from 'react';
import { cleanString } from '../../helpers/utils';
import FieldButton from '../FieldButton';
import styles from './Field.module.scss';

export default function Field({ title, label, index, parentsection, deleteField, children, value }) {
    const ref = useRef(null);

    const deleteCurrentField = () => {
        deleteField(ref.current);
    };

    return <Container fluid>
        <Row alignItems="middle" gutters>
            <Col>
                {Children.toArray(children).map((child, i) => {
                    const field = cloneElement(child, {
                        title,
                        label,
                        value,
                        parentsection,
                        keynumber: index,
                    });

                    return <div key={i} ref={ref} className={styles.Field}>
                        <Container fluid>
                            <Row alignItems="bottom" gutters>
                                <Col n={index > 0 ? '8' : '12'}>
                                    {field}
                                </Col>
                                {index > 0 && <Col n="4"><FieldButton
                                    dataTestid={`btn-delete-${cleanString(label)}`}
                                    title={`Supprimer`}
                                    onClick={deleteCurrentField}/></Col>}
                            </Row>
                        </Container>
                    </div>;
                })}
            </Col>
        </Row>
    </Container>;
}
