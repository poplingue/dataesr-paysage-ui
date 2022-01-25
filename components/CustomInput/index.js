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
    validatorId,
}) {
    const { Col, Row, Container } = grid();

    return (
        <Container fluid>
            <section className="wrapper-input">
                <Row alignItems="bottom" gutters>
                    {infinite ? (
                        <InfiniteField
                            title={title}
                            section={section}
                            validatorId={validatorId}
                        >
                            <Input
                                updateValidSection={updateValidSection}
                                validatorConfig={validatorConfig}
                                title={title}
                                validatorId={validatorId}
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
                                validatorId={validatorId}
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
