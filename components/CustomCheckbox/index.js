import {
    Checkbox,
    CheckboxGroup,
    Col,
    Container,
    Row,
} from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getUrl } from '../../helpers/constants';
import {
    cleanString,
    getFieldValue,
    getFormName,
    getUniqueId,
} from '../../helpers/utils';
import useValidator from '../../hooks/useValidator';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';

function CustomCheckbox({
    title,
    staticValues = [],
    section,
    validatorConfig,
    updateValidSection,
}) {
    const {
        stateForm: { forms, storeObjects },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, section, title, 0);
    const [checkboxValues, setCheckboxValues] = useState(() =>
        staticValues.map((elm) => {
            return { label: elm, checked: false, value: cleanString(elm) };
        })
    );
    const [values, setValues] = useState([]);
    const { checkField, message, type } = useValidator(validatorConfig);

    const onCheckboxChange = async (value) => {
        const checkStoreObject = storeObjects.indexOf(formName) > -1;
        let newValues;

        newValues = values && values.filter((item) => item !== value);

        if (values.indexOf(value) < 0) {
            newValues = [...values, value];
        }

        setValues(newValues);

        const payload = {
            value: newValues,
            uid,
            formName,
        };

        if (!newValues.length) {
            dispatch({ type: 'DELETE_FORM_FIELD', payload });
            await DBService.delete(uid, formName);
            NotifService.techInfo('Checkbox field deleted');
        } else {
            dispatch({
                type: 'UPDATE_FORM_FIELD',
                payload,
            });

            if (checkStoreObject) {
                await DBService.set(
                    {
                        value: newValues,
                        uid,
                    },
                    formName
                );
            }
        }

        checkField(newValues.join(' '));
        updateValidSection(null, null);
    };

    const fetchData = useCallback(() => {
        // case no static values
        fetch(getUrl(cleanString(title)))
            .then((res) => res.json())
            .then(() => {
                // fake data
                const fakeData = ['1', '2', '3'].map((s) => {
                    return { value: s, label: s, checked: false };
                });
                setCheckboxValues(fakeData);
            });
    }, [title]);

    useEffect(() => {
        let update = false;

        const newCheckboxes = checkboxValues.map((checkbox) => {
            const { checked, value } = checkbox;
            const isChecked =
                getFieldValue(forms, formName, uid).indexOf(value) >= 0;

            if (!update && checked !== isChecked) {
                update = true;
            }

            return { ...checkbox, checked: isChecked };
        });

        if (update) {
            setCheckboxValues(newCheckboxes);
            update = false;
        }

        checkField(getFieldValue(forms, formName, uid), 'silent');
    }, [checkField, checkboxValues, formName, forms, uid]);

    useEffect(() => {
        if (!staticValues.length && !checkboxValues.length) {
            fetchData();
        }
    }, [checkboxValues.length, fetchData, staticValues.length]);

    const onChange = (e) => {
        const { value } = e.target;
        onCheckboxChange(value);
    };

    useEffect(() => {
        updateValidSection(uid, type);
    }, [type, uid, updateValidSection]);

    return (
        <Container fluid>
            <section className="wrapper-input">
                <Row>
                    <Col spacing="py-1w">
                        <CheckboxGroup
                            ariaLabel={title}
                            legend={title}
                            data-field={uid}
                            message={message}
                            messageType={type}
                        >
                            {checkboxValues.map((checkbox) => {
                                const { value, label, checked } = checkbox;

                                return (
                                    <Checkbox
                                        data-cy={value}
                                        key={value}
                                        label={label}
                                        value={value}
                                        checked={checked}
                                        onChange={(e) => onChange(e)}
                                    />
                                );
                            })}
                        </CheckboxGroup>
                    </Col>
                </Row>
            </section>
        </Container>
    );
}

export default CustomCheckbox;
