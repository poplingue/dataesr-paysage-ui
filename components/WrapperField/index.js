import { Col, Container, Icon, Row, Text } from '@dataesr/react-dsfr';
import { cloneElement } from 'react';
import useCSSProperty from '../../hooks/useCSSProperty';
import useViewport from '../../hooks/useViewport';
import styles from './WrapperField.module.scss';

function WrapperField({ children, unSaved, inline }) {
    const { style: orange } = useCSSProperty('--warning-main-525');
    const { mobile, tablet } = useViewport();

    if (!unSaved) {
        return children;
    }

    const inlineActive = tablet || mobile || inline;

    return (
        <Container fluid>
            <Row alignItems="middle">
                <Col n={`${inline ? '12' : '12 lg-11'}`}>
                    {cloneElement(children, {
                        ...children.props,
                        className: styles.UnSavedField,
                    })}
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
            </Row>
        </Container>
    );
}

export default WrapperField;
