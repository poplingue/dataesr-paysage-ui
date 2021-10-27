import { Container, Row, Col } from '@dataesr/react-dsfr';
import InfiniteField from '../InfiniteField';
import Input from './Input';

function CustomInput({ title, infinite, parentsection }) {
    return (
        <Container fluid>
            <section className="wrapper-input">
                <Row alignItems="bottom" gutters>
                    {infinite ? (
                        <InfiniteField
                            title={title}
                            parentsection={parentsection}
                        >
                            <Input
                                title={title}
                                parentsection={parentsection}
                            />
                        </InfiniteField>
                    ) : (
                        <Col spacing="py-3w">
                            <Input
                                title={title}
                                label={title}
                                keynumber={0}
                                parentsection={parentsection}
                            />
                        </Col>
                    )}
                </Row>
            </section>
        </Container>
    );
}

export default CustomInput;
