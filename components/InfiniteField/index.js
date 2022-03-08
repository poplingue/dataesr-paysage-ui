import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import {
    checkFlatMap,
    getField,
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

function InfiniteField({ children, title, section, validatorId, subObject }) {
    const { Col, Row, Container } = grid();

    const {
        stateForm: { forms, storeObjects, updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const [numberOfFields, setNumberOfFields] = useState(0);
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
                    checkFlatMap[
                        fieldId.indexOf(`${subObject}_${validatorId}`) > -1 &&
                            fieldId !== uid
                    ](value)
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
            for (let i = 1; i < numberOfFields; i = i + 1) {
                // all fields after the deleted one
                if (i > indexRef) {
                    const retrievedValue = getFieldValue(
                        forms,
                        formName,
                        getUniqueId(formName, subObject, validatorId, i)
                    );
                    const newUid = getUniqueId(
                        formName,
                        subObject,
                        validatorId,
                        i - 1
                    );
                    const newField = { uid: newUid, value: retrievedValue };

                    // update global state
                    dispatch({
                        type: 'UPDATE_FORM_FIELD',
                        payload: {
                            formName,
                            ...newField,
                        },
                    });

                    if (checkStoreObject) {
                        // update indexDB
                        await DBService.set(newField, formName);
                    }
                }
            }

            // Delete old field
            let key = numberOfFields - indexRef;

            if (
                indexRef === numberOfFields - 1 ||
                indexRef === numberOfFields
            ) {
                key = numberOfFields - 1;
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

            // update global state
            dispatch({ type: 'DELETE_FORM_FIELD', payload });

            // update local nulber of field
            setNumberOfFields(numberOfFields - 1);

            // update indexDB
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

            setNumberOfFields(initInfinite.length || 1);
        }
    }, [forms, section, formName, pathname, validatorId, subObject]);

    return (
        <Col n="12">
            <Container fluid>
                <Row>
                    <Col n="12">
                        {Array.apply(null, { length: numberOfFields }).map(
                            (v, i) => {
                                const newTitle = `${title}#${i}`;
                                const uid = getUniqueId(
                                    formName,
                                    subObject,
                                    validatorId,
                                    i
                                );
                                const unSaved =
                                    getField(forms, formName, uid)?.unSaved ||
                                    false;

                                return (
                                    <Field
                                        key={getUniqueId(
                                            formName,
                                            '',
                                            title,
                                            i
                                        )}
                                        value={getFieldValue(
                                            forms,
                                            formName,
                                            uid
                                        )}
                                        unSaved={unSaved}
                                        index={i}
                                        title={title}
                                        label={newTitle}
                                        deleteField={deleteField}
                                        section={section}
                                    >
                                        {children}
                                    </Field>
                                );
                            }
                        )}
                    </Col>
                    <Col>
                        <FieldButton
                            colors={[dark, white]}
                            icon="ri-add-line"
                            dataTestId="btn-add"
                            onClick={() =>
                                setNumberOfFields(numberOfFields + 1)
                            }
                            title={title}
                        />
                    </Col>
                </Row>
            </Container>
        </Col>
    );
}

InfiniteField.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
    title: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    validatorId: PropTypes.string.isRequired,
    subObject: PropTypes.string.isRequired,
};

export default InfiniteField;
