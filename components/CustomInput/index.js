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
    subObject,
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
                                subObject={subObject}
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
                                subObject={subObject}
                            />
                        </Col>
                    )}
                </Row>
            </section>
        </Container>
    );
}

export default CustomInput;
