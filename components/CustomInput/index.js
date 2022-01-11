import grid from '../../helpers/imports';
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
    const { Col, Row, Container } = grid();

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
                                label={title}
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
