import AddFieldButton from '../AddButton';
import { useState } from 'react';
import Input from './Input';
import { Container, Row, Col } from '@dataesr/react-dsfr';

function CustomInput({ title, infinite }) {
    const [number, setNumber] = useState(1);
    const plusOne = () => {
        setNumber(number + 1);
    };
    return (<Container fluid>
        <section className="wrapper-input py-10">
            <Row alignItems="bottom" gutters>
                <Col>
                    {Array.apply(null, { length: number }).map((v, i) => {
                            return <div key={i}>
                                <Input label={title}/>
                            </div>;
                        }
                    )}
                </Col>
                <Col>
                    {infinite && <AddFieldButton onClick={plusOne} title={title}/>}
                </Col>
            </Row>
        </section>
    </Container>);
}

export default CustomInput;