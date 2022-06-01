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
import { FieldDependency } from '../FieldDependencie';
import SavingWrapper from '../SavingWrapper';

// TODO add proptypes
function CustomRadio({
    title,
    defaultLabel,
    hint,
    staticValues = [],
    subObject,
    infinite,
    validatorId,
    updateValidSection,
}) {
    const { Col, Row, Container } = grid();

    const [radioValues, setRadioValues] = useState([]);
    const [currentLabel, setCurrentLabel] = useState(defaultLabel);

    const {
        stateForm: { forms, storeObjects },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();

    const validatorConfig = configValidators[object]
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
            infinite,
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
            value: currentLabel || getFieldValue(forms, formName, uid),
            mode: 'silent',
        });
    }, [
        currentLabel,
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

        setCurrentLabel('');

        const lowValue = value.toLowerCase();

        const checkValue = {
            true: () => lowValue === 'true',
            false: () => value,
        };

        // param must be boolean
        onRadioChange(
            checkValue[lowValue === 'true' || lowValue === 'false']()
        );

        checkField({ value });
    };

    useEffect(() => {
        updateValidSection(uid, type);
    }, [type, uid, updateValidSection]);

    return (
        <FieldDependency subObject={subObject} validatorId={validatorId}>
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
                                        let checked = false;

                                        // TODO refacto
                                        // case defaultLabel
                                        if (currentLabel) {
                                            checked = label === currentLabel;
                                        }

                                        // case indexDB data
                                        if (
                                            formName &&
                                            getFieldValue(
                                                forms,
                                                formName,
                                                uid
                                            ) !== ''
                                        ) {
                                            checked =
                                                value ===
                                                getFieldValue(
                                                    forms,
                                                    formName,
                                                    uid
                                                );
                                        }

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
        </FieldDependency>
    );
}

export default CustomRadio;
