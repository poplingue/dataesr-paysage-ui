import { Container, Row, Col } from '@dataesr/react-dsfr';
import InfiniteField from '../InfiniteField';
import Input from './Input';

function CustomInput({
    title,
    value,
    infinite,
    section,
    validatorConfig,
    updateValidSection,
}) {
    return (
        <Container fluid>
            <section className="wrapper-input">
                <Row alignItems="bottom" gutters>
                    {infinite ? (
                        <InfiniteField title={title} section={section}>
                            <Input
                                updateValidSection={updateValidSection}
                                validatorConfig={validatorConfig}
                                title={title}
                                section={section}
                            />
                        </InfiniteField>
                    ) : (
                        <Col spacing="py-1w">
                            <Input
                                value={value}
                                updateValidSection={updateValidSection}
                                validatorConfig={validatorConfig}
                                title={title}
                                label={title}
                                index={0}
                                section={section}
                            />
                        </Col>
                    )}
                </Row>
            </section>
        </Container>
    );
}

export default CustomInput;
