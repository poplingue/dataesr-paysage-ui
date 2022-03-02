import { Radio, RadioGroup } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { configValidators } from '../../config/objects';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import {
    getFieldValue,
    getFormName,
    getSubObjectType,
    getUniqueId,
    isFieldUnSaved,
} from '../../helpers/utils';
import useValidator from '../../hooks/useValidator';
import DBService from '../../services/DB.service';
import SavingWrapper from '../SavingWrapper';

function CustomRadio({
    title,
    hint,
    staticValues = [],
    subObject,
    validatorId,
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
    const validatorConfig = object
        ? configValidators[object][getSubObjectType(subObject)][validatorId]
        : null;
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, validatorId);
    const unSaved = isFieldUnSaved(forms, formName, uid);

    const { checkField, message, type } = useValidator(validatorConfig);

    const onRadioChange = async (value) => {
        const checkStoreObject = storeObjects.indexOf(formName) > -1;

        const payload = {
            value,
            uid,
            unSaved: true,
        };

        dispatch({
            type: 'UPDATE_FORM_FIELD',
            payload: { ...payload, formName },
        });

        if (checkStoreObject) {
            await DBService.set(payload, formName);
        }
    };

    useEffect(() => {
        if (!radioValues.length) {
            setRadioValues(
                staticValues.map(({ value, labelValue }) => {
                    return { value, label: labelValue };
                })
            );
        }

        checkField({
            value: getFieldValue(forms, formName, uid),
            mode: 'silent',
        });
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
        const checkType = {
            true: (value) => {
                return value.toLowerCase() === 'true';
            },
            false: (value) => {
                return value;
            },
        };

        // TODO refacto
        onRadioChange(
            checkType[
                value.toLowerCase() === 'true' ||
                    value.toLowerCase() === 'false'
            ](value)
        );

        checkField({ value });
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
                        <SavingWrapper unSaved={unSaved}>
                            <RadioGroup
                                isInline
                                legend={title}
                                hint={hint}
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
                                            size="sm"
                                            data-cy={value}
                                            key={i}
                                            label={label}
                                            value={value.toString()}
                                            checked={checked}
                                            onChange={onChange}
                                        />
                                    );
                                })}
                            </RadioGroup>
                        </SavingWrapper>
                    </Col>
                </Row>
            </section>
        </Container>
    );
}

export default CustomRadio;
