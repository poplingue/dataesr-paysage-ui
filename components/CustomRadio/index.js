import { useState, useEffect } from 'react';
import { Radio, RadioGroup, Container, Row, Col } from '@dataesr/react-dsfr';
import { getUrl } from '../../helpers/constants';

function CustomRadio({ title, staticValues = [] }) {
    const [radioValues, setRadioValues] = useState([]);
    useEffect(() => {
        if (!staticValues.length && !radioValues.length) {
            fetch(getUrl(title))
                .then(res => res.json())
                .then(json => {
                    const fakeData = ['1', '2', '3'].map((s) => {
                        return { value: s, label: s };
                    });
                    setRadioValues(fakeData);
                });
        } else if (!radioValues.length) {
            setRadioValues(staticValues.map((value) => {
                return { 'value': value, 'label': value };
            }));
        }
    }, [radioValues, setRadioValues, staticValues, title]);
    return (<Container fluid>
        <section className="wrapper-input py-10">
            <Row>
                <Col>
                    <RadioGroup legend={title} isInline>
                        {radioValues.map((radio, i) => {
                            return <Radio
                                key={i}
                                label={radio.label}
                                value={radio.value}
                            />;
                        })}
                    </RadioGroup>
                </Col>
            </Row>
        </section>
    </Container>);
}

export default CustomRadio;