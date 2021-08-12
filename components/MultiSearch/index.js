import { Checkbox, TextInput, Col, Container, Row } from '@dataesr/react-dsfr';
import { useState } from 'react';
import DEPARTEMENTS from './DEPARTEMENTS';
import styles from './MultiSearch.module.scss';
import { v4 as uuidv4 } from 'uuid';

function MultiSearch({ title }) {
    // TODO manage indexDB
    const [selectedValues, setSelectedvalues] = useState([]);
    const [textValue, setTextValue] = useState('');
    const options = DEPARTEMENTS.map((departement) => ({ value: departement, label: departement }));
    const filter = (
        internalValue,
        option,
    ) => option.label.toLowerCase().includes(internalValue.toLowerCase());

    const filteredOptions = options.filter((option, index, arr) => filter(textValue, option, index, arr));
    return (
        <section className="wrapper-multi-search py-10">
            <TextInput
                onChange={(e) => setTextValue(e.target.value)}
                value={textValue}
                label={title}
            />
            <Container>
                <Row>
                    <Col n="6">
                        <ul className="max-200">
                            {filteredOptions.map((departement) => {
                                return <li key={uuidv4()} className={`${styles.listElement} py-10`}>
                                    <Checkbox
                                        label={departement.label}
                                        onChange={(e) => {
                                            if (selectedValues.indexOf(e.target.value) === -1) {
                                                setSelectedvalues((prev) => [...prev, e.target.value]);
                                            } else {
                                                setSelectedvalues(selectedValues.filter((item) => item !== e.target.value));
                                            }
                                        }}
                                        defaultChecked={selectedValues.indexOf(departement.value) > -1}
                                        value={departement.value}
                                    />
                                </li>;
                            })}
                        </ul>
                    </Col>
                    <Col n="6">
                        {selectedValues.length > 0 && (<ul>
                            {selectedValues.map((selected) => {
                                return <li key={uuidv4()}>{selected}</li>;
                            })}
                        </ul>)}
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default MultiSearch;
