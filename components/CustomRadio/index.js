import { Radio, RadioGroup } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getUrl } from '../../helpers/constants';
import grid from '../../helpers/imports';
import { getFieldValue, getFormName, getUniqueId } from '../../helpers/utils';
import useValidator from '../../hooks/useValidator';
import DBService from '../../services/DB.service';

function CustomRadio({
    title,
    staticValues = [],
    section,
    subObject,
    validatorConfig,
    updateValidSection,
}) {
    const { Col, Row, Container } = grid();

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
    const uid = getUniqueId(formName, subObject, title, 0);
    const { checkField, message, type } = useValidator(validatorConfig);

    const onRadioChange = async (value) => {
        const checkStoreObject = storeObjects.indexOf(formName) > -1;

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
                .then((res) => res.json())
                .then(() => {
                    // fake data
                    const fakeData = ['1', '2', '3'].map((s) => {
                        return { value: s, label: s };
                    });
                    setRadioValues(fakeData);
                });
        } else if (!radioValues.length) {
            setRadioValues(
                staticValues.map((value) => {
                    return { value, label: value };
                })
            );
        }

        checkField(getFieldValue(forms, formName, uid), 'silent');
    }, [
        checkField,
        formName,
        forms,
        radioValues,
        setRadioValues,
        staticValues,
        title,
        uid,
    ]);

    const onChange = (e) => {
        const { value } = e.target;
        onRadioChange(value);
        checkField(value);
        updateValidSection(null, null);
    };

    useEffect(() => {
        updateValidSection(uid, type);
    }, [type, uid, updateValidSection]);

    return (
        <Container fluid>
            <section className="wrapper-input">
                <Row>
                    <Col spacing="py-1w">
                        <RadioGroup
                            legend={title}
                            data-field={uid}
                            message={message}
                            messageType={type}
                        >
                            {radioValues.map((radio, i) => {
                                const { value, label } = radio;
                                const checked = formName
                                    ? value ===
                                      getFieldValue(forms, formName, uid)
                                    : false;

                                return (
                                    <Radio
                                        data-cy={value}
                                        key={i}
                                        label={label}
                                        value={value}
                                        checked={checked}
                                        onChange={onChange}
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
