import { Badge, Col, Container, Row } from '@dataesr/react-dsfr';
import { cloneElement } from 'react';
import useCSSProperty from '../../hooks/useCSSProperty';
import useViewport from '../../hooks/useViewport';
import styles from './SavingWrapper.module.scss';

function SavingWrapper({ children, unSaved, inline }) {
    const { style: orange } = useCSSProperty('--pink-tuile-425');
    const { mobile, tablet } = useViewport();

    const inlineActive = tablet || mobile || inline;
    const newChildren = cloneElement(children, {
        ...children.props,
        className: styles.UnSavedField,
    });

    return (
        <Container fluid>
            <Row alignItems="bottom">
                {unSaved ? (
                    <>
                        <Col n="12">{newChildren}</Col>
                        <Col n="12">
                            <Badge
                                text="non sauvegardé"
                                small
                                type="warning"
                                colorFamily="pink-tuile"
                            />
                        </Col>
                    </>
                ) : (
                    <Col>{children}</Col>
                )}
            </Row>
        </Container>
    );
}

export default SavingWrapper;
