import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import {
    getFieldValue,
    getForm,
    getFormName,
    getUniqueId,
} from '../../helpers/utils';

import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import FieldButton from '../FieldButton';
import Field from './Field';

// TODO add propTypes
function InfiniteField({ children, title, section, validatorId, subObject }) {
    const { Col, Row, Container } = grid();

    const {
        stateForm: { forms, storeObjects, updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const [number, setNumber] = useState(0);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const { style: dark } = useCSSProperty('--grey-425');
    const { style: white } = useCSSProperty('--grey-1000');

    const deleteField = async (ref) => {
        const element = ref.querySelectorAll('[data-field]');

        if (element && element.length) {
            const uid = element[0].getAttribute('data-field');

            // TODO in sw.js
            const newValues = getForm(forms, formName).flatMap(
                ({ uid: fieldId, value }) =>
                    fieldId.indexOf(validatorId) > -1 && fieldId !== uid
                        ? value
                        : []
            );

            dataFormService
                .deleteField(
                    object,
                    updateObjectId,
                    subObject,
                    validatorId,
                    newValues
                )
                .then(() => {
                    NotifService.info(`Champs supprimé`, 'valid');
                });

            const indexRef = parseFloat(uid.charAt(uid.length - 1));
            const checkStoreObject = storeObjects.indexOf(formName) > -1;

            // Reassign fields values
            for (let i = 1; i < number; i = i + 1) {
                // all field after the delete one
                if (i > indexRef) {
                    const update = {
                        uid: getUniqueId(
                            formName,
                            subObject,
                            validatorId,
                            i - 1
                        ),
                        value: getFieldValue(
                            forms,
                            formName,
                            getUniqueId(formName, subObject, validatorId, i)
                        ),
                    };

                    dispatch({
                        type: 'UPDATE_FORM_FIELD',
                        payload: {
                            formName,
                            ...update,
                        },
                    });

                    if (checkStoreObject) {
                        // TODO refacto getFieldValue
                        await DBService.set(update, formName);
                    }
                }
            }

            // delete field
            let key = number - indexRef;

            if (indexRef === number - 1 || indexRef === number) {
                key = number - 1;
            }

            const uidToDelete = getUniqueId(
                formName,
                subObject,
                validatorId,
                key
            );

            const payload = {
                uid: uidToDelete,
                formName,
            };
            dispatch({ type: 'DELETE_FORM_FIELD', payload });

            setNumber(number - 1);

            await DBService.delete(uidToDelete, formName);
            NotifService.techInfo('Field deleted');
        }
    };

    useEffect(() => {
        const currentForm = getForm(forms, formName);

        if (currentForm) {
            const initInfinite = currentForm.filter((field, i) =>
                field.uid.startsWith(
                    getUniqueId(formName, subObject, validatorId)
                )
            );

            setNumber(initInfinite.length || 1);
        }
    }, [forms, section, formName, pathname, validatorId, subObject]);

    return (
        <Col n="12">
            <Container fluid>
                <Row>
                    <Col n="12">
                        {Array.apply(null, { length: number }).map((v, i) => {
                            const value =
                                getFieldValue(
                                    forms,
                                    formName,
                                    getUniqueId(
                                        formName,
                                        subObject,
                                        validatorId,
                                        i
                                    )
                                ) || '';

                            const newTitle = `${title}#${i}`;

                            return (
                                <Field
                                    key={getUniqueId(formName, '', title, i)}
                                    value={value}
                                    index={i}
                                    title={title}
                                    label={newTitle}
                                    deleteField={deleteField}
                                    section={section}
                                >
                                    {children}
                                </Field>
                            );
                        })}
                    </Col>
                    <Col>
                        <FieldButton
                            colors={[dark, white]}
                            icon="ri-add-line"
                            dataTestId="btn-add"
                            onClick={() => setNumber(number + 1)}
                            title={title}
                        />
                    </Col>
                </Row>
            </Container>
        </Col>
    );
}

export default InfiniteField;
