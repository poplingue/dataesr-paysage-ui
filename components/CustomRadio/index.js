import { Col, Container, Radio, RadioGroup, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getUrl } from '../../helpers/constants';
import { getField, getFormName, getUniqueId } from '../../helpers/utils';

function CustomRadio({ title, staticValues = [], parentsection }) {
    const [radioValues, setRadioValues] = useState([]);
    const { state: { forms }, dispatch } = useContext(AppContext);
    const { pathname } = useRouter();
    const uniqueId = getUniqueId(pathname, parentsection, title, 0);
    const formName = getFormName(pathname);

    const onRadioChange = (e) => {
        dispatch({
            type: 'UPDATE_FORM_FIELD',
            payload: { value: e.target.value, uid: uniqueId, formName }
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
                            const { value, label } = radio;

                            return <Radio
                                data-cy={value}
                                key={i}
                                label={label}
                                value={value}
                                isChecked={formName ? value === getField(forms, formName, uniqueId) : false}
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
