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
                            subObject={subObject}
                        >
                            <Input
                                updateValidSection={updateValidSection}
                                validatorConfig={validatorConfig}
                                validatorId={validatorId}
                                subObject={subObject}
                                label={title}
                                infinite
                            />
                        </InfiniteField>
                    ) : (
                        <Col spacing="py-1w">
                            <Input
                                value={value}
                                updateValidSection={updateValidSection}
                                validatorConfig={validatorConfig}
                                validatorId={validatorId}
                                label={title}
                                index={0}
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
