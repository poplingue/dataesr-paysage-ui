import Input from './Input';
import { Container, Row, Col } from '@dataesr/react-dsfr';
import InfiniteField from '../InfiniteField';

function CustomInput({ title, infinite, parentsection }) {
    return (<Container fluid>
        <section className="wrapper-input py-10">
            <Row alignItems="bottom" gutters>
                {infinite ? <InfiniteField title={title} parentsection={parentsection}>
                    <Input
                        title={title}
                        parentsection={parentsection}/>
                </InfiniteField> : <Col>
                    <Input
                        title={title}
                        label={title}
                        keynumber={0}
                        parentsection={parentsection}/>
                </Col>}
            </Row>
        </section>
    </Container>);
}

export default CustomInput;
