import { Col, Container, Radio, RadioGroup, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getUrl } from '../../helpers/constants';
import { getFieldValue, getFormName, getUniqueId } from '../../helpers/utils';
import DBService from '../../services/DBService';

function CustomRadio({ title, staticValues = [], parentsection }) {
    const [radioValues, setRadioValues] = useState([]);
    const {
        stateForm: { forms, storeObjects },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, parentsection, title, 0);

    const onRadioChange = async e => {
        const checkStoreObject = storeObjects.indexOf(formName) > -1;
        const { value } = e.target;

        dispatch({
            type: 'UPDATE_FORM_FIELD',
            payload: { value, uid, formName },
        });

        if (checkStoreObject) {
            await DBService.set(
                {
                    value,
                    uid,
                },
                formName
            );
        }
    };

    useEffect(() => {
        if (!staticValues.length && !radioValues.length) {
            // case no static values
            fetch(getUrl(title))
                .then(res => res.json())
                .then(json => {
                    // fake data
                    const fakeData = ['1', '2', '3'].map(s => {
                        return { value: s, label: s };
                    });
                    setRadioValues(fakeData);
                });
        } else if (!radioValues.length) {
            setRadioValues(
                staticValues.map(value => {
                    return { value: value, label: value };
                })
            );
        }
    }, [radioValues, setRadioValues, staticValues, title]);

    return (
        <Container fluid>
            <section className="wrapper-input">
                <Row>
                    <Col spacing="py-3w">
                        <RadioGroup legend={title} isInline data-field={uid}>
                            {radioValues.map((radio, i) => {
                                const { value, label } = radio;

                                return (
                                    <Radio
                                        data-cy={value}
                                        key={i}
                                        label={label}
                                        value={value}
                                        checked={
                                            formName
                                                ? value ===
                                                  getFieldValue(
                                                      forms,
                                                      formName,
                                                      uid
                                                  )
                                                : false
                                        }
                                        onChange={e => onRadioChange(e)}
                                    />
                                );
                            })}
                        </RadioGroup>
                    </Col>
                </Row>
            </section>
        </Container>
    );
}

export default CustomRadio;
