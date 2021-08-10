import Input from './Input';
import { Container, Row, Col } from '@dataesr/react-dsfr';
import InfiniteField from '../InfiniteField';

function CustomInput({ title, infinite, parentSection }) {
    return (<Container fluid>
        <section className="wrapper-input py-10">
            <Row alignItems="bottom" gutters>
                {infinite ? <InfiniteField title={title}>
                    <Input
                        label={title}
                        parentSection={parentSection}/>
                </InfiniteField> : <Col>
                    <Input
                        label={title}
                        keyNumber={0}
                        parentSection={parentSection}/>
                </Col>}
            </Row>
        </section>
    </Container>);
}

export default CustomInput;