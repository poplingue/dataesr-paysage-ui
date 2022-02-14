import { Col, Container, Icon, Row, Text } from '@dataesr/react-dsfr';
import { cloneElement } from 'react';
import useCSSProperty from '../../hooks/useCSSProperty';
import useViewport from '../../hooks/useViewport';
import styles from './WrapperField.module.scss';

function WrapperField({ children, unSaved, inline }) {
    const { style: orange } = useCSSProperty('--warning-main-525');
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
                        <Col n={`${inline ? '12' : '12 lg-11'}`}>
                            {newChildren}
                        </Col>
                        <Col n={`${inline ? '12' : '12 lg-1'}`}>
                            <Icon
                                name="ri-error-warning-line"
                                size="1x"
                                color={orange}
                                iconPosition={inlineActive ? 'left' : 'center'}
                            >
                                <div
                                    className={`${styles.UnSavedText} ${
                                        inlineActive ? '' : 'txt-center'
                                    }`}
                                >
                                    <Text
                                        size="xs"
                                        spacing="m-0"
                                        as={inlineActive ? 'span' : 'p'}
                                    >
                                        non sauvegardé
                                    </Text>
                                </div>
                            </Icon>
                        </Col>
                    </>
                ) : (
                    <Col>{children}</Col>
                )}
            </Row>
        </Container>
    );
}

export default WrapperField;
