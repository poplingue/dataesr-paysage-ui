import AddFieldButton from '../AddButton';
import { useState } from 'react';
import { TextInput, Container, Row, Col } from '@dataesr/react-dsfr';

function CustomInput({ title, infinite }) {
    const [number, setNumber] = useState(1);
    const plusOne = () => {
        setNumber(number + 1);
    };
    const [textValue, setTextValue] = useState('');
    return (<Container fluid>
        <section className="wrapper-input py-10">
            <Row alignItems="bottom" gutters>
                <Col>
                    {Array.apply(null, { length: number }).map((v, i) => {
                            return <div key={i}>
                                <TextInput
                                    onChange={(e) => setTextValue(e.target.value)}
                                    value={textValue}
                                    label={title}
                                />
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