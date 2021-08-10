import { useState, useEffect, useContext } from 'react';
import { Radio, RadioGroup, Container, Row, Col } from '@dataesr/react-dsfr';
import { getUrl } from '../../helpers/constants';
import { getFormName, getUniqueId } from '../../helpers/utils';
import { AppContext } from '../../context/GlobalState';
import { useRouter } from 'next/router';

function CustomRadio({ title, staticValues = [], parentSection }) {
    const [radioValues, setRadioValues] = useState([]);
    const { state, dispatch } = useContext(AppContext);
    const router = useRouter();
    const uniqueId = getUniqueId(router.pathname, parentSection, title, 0);
    const onRadioChange = (e) => {
        dispatch({
            type: 'UPDATE_FORM_FIELD',
            payload: { value: e.target.value, uid: uniqueId, name: getFormName(router.pathname), dataAtt: uniqueId }
        });
    };
    useEffect(() => {
        if (!staticValues.length && !radioValues.length) {
            // case no static values
            fetch(getUrl(title))
                .then(res => res.json())
                .then(json => {
                    // fake data
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
                    <RadioGroup legend={title} isInline data-field={uniqueId}>
                        {radioValues.map((radio, i) => {
                            return <Radio
                                key={i}
                                label={radio.label}
                                value={radio.value}
                                isChecked={radio.label === state.forms[state.objectStoreName][uniqueId]}
                                onChange={(e) => onRadioChange(e)}
                            />;
                        })}
                    </RadioGroup>
                </Col>
            </Row>
        </section>
    </Container>);
}

export default CustomRadio;