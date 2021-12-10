import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import {
    getFieldValue,
    getForm,
    getFormName,
    getUniqueId,
} from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import Field from '../Field';
import FieldButton from '../FieldButton';

function InfiniteField({ children, title, section }) {
    const {
        stateForm: { forms, storeObjects },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const [number, setNumber] = useState(0);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const { style: dark } = useCSSProperty('--grey-425');

    const deleteField = async (ref) => {
        const element = ref.querySelectorAll('[data-field]');

        if (element && element.length) {
            const uid = element[0].getAttribute('data-field');
            const indexRef = parseFloat(uid.charAt(uid.length - 1));
            const checkStoreObject = storeObjects.indexOf(formName) > -1;

            // Reassign fields values
            for (let i = 1; i < number; i = i + 1) {
                // all field after the delete one
                if (i > indexRef) {
                    const update = {
                        uid: getUniqueId(formName, section, title, i - 1),
                        value: getFieldValue(
                            forms,
                            formName,
                            getUniqueId(formName, section, title, i)
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

            const uidToDelete = getUniqueId(formName, section, title, key);
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
            const initInfinite = currentForm.filter((field) =>
                field.uid.startsWith(getUniqueId(formName, section, title))
            );
            setNumber(initInfinite.length || 1);
        }
    }, [forms, title, section, formName, pathname]);

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
                                    getUniqueId(formName, section, title, i)
                                ) || null;
                            const newTitle = `${title}#${i}`;

                            return (
                                <Field
                                    key={getUniqueId(formName, '', title, i)}
                                    value={value}
                                    index={i}
                                    pathname={pathname}
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
                            colors={[dark, '#fff']}
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
