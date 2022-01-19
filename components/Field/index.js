import PropTypes from 'prop-types';
import { Children, cloneElement, useRef } from 'react';
import grid from '../../helpers/imports';
import DeleteButton from '../InfiniteAccordion/DeleteButton';
import styles from './Field.module.scss';

export default function Field({
    title,
    label,
    index,
    section,
    deleteField,
    children,
    value,
}) {
    const { Col, Row, Container } = grid();
    const ref = useRef(null);

    const deleteCurrentField = () => {
        deleteField(ref.current);
    };

    return (
        <Container fluid>
            <Row alignItems="middle" gutters>
                <Col>
                    {Children.toArray(children).map((child, i) => {
                        const field = cloneElement(child, {
                            title,
                            label,
                            value,
                            section,
                            index,
                        });

                        return (
                            <div key={i} ref={ref} className={styles.Field}>
                                <Container fluid>
                                    <Row alignItems="bottom" gutters>
                                        <Col n={index > 0 ? '8' : '12'}>
                                            {field}
                                        </Col>
                                        {index > 0 && (
                                            // TODO remove props label
                                            <Col n="4">
                                                <DeleteButton
                                                    display
                                                    label={label}
                                                    onclick={deleteCurrentField}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                </Container>
                            </div>
                        );
                    })}
                </Col>
            </Row>
        </Container>
    );
}

Field.defaultProps = {
    value: '',
};

Field.propTypes = {
    title: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    section: PropTypes.string.isRequired,
    deleteField: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
    value: PropTypes.string,
};
