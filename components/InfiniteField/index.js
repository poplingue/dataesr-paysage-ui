import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFieldValue, getForm, getFormName, getUniqueId } from '../../helpers/utils';
import Field from '../Field';
import FieldButton from '../FieldButton';

function InfiniteField({ children, title, parentsection }) {
    const { state: { forms }, dispatch } = useContext(AppContext);
    const [number, setNumber] = useState(0);
    const { pathname } = useRouter();
    const formName = getFormName(pathname);

    const deleteField = (ref) => {
        // TODO check better
        const element = ref.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        const uid = element.getAttribute('data-field');
        const indexRef = parseFloat(uid.charAt(uid.length - 1));

        // Reassign fields values
        for (let i = 1; i < number; i = i + 1) {

            // all field after the delete one
            if (i > indexRef) {

                dispatch({
                    type: 'UPDATE_FORM_FIELD', payload: {
                        formName,
                        value: getFieldValue(forms, formName, getUniqueId(pathname, parentsection, title, i)),
                        uid: getUniqueId(pathname, parentsection, title, i - 1)
                    }
                });
            }
        }

        // delete field
        let key = number - indexRef;

        if (indexRef === (number - 1) || indexRef === number) {
            key = number - 1;
        }

        const payload = {
            uid: getUniqueId(pathname, parentsection, title, key),
            formName
        };
        dispatch({ type: 'DELETE_FORM_FIELD', payload });

        setNumber(number - 1);
    };

    useEffect(() => {
        const currentForm = getForm(forms, formName);

        if (currentForm) {
            const initInfinite = currentForm.filter((field) => field.uid.startsWith(getUniqueId(pathname, parentsection, title)));
            setNumber(initInfinite.length || 1);
        }
    }, [forms, title, parentsection, formName, pathname]);

    return (<Col n="12">
            <Container fluid>
                <Row>
                    <Col n="12">
                        {Array.apply(null, { length: number }).map((v, i) => {
                                const value = getFieldValue(forms, formName, getUniqueId(pathname, parentsection, title, i)) || null;
                                const newTitle = `${title}#${i}`;

                                return <Field
                                    key={getUniqueId(pathname, '', title, i)}
                                    value={value}
                                    index={i}
                                    pathname={pathname}
                                    title={title}
                                    label={newTitle}
                                    deleteField={deleteField}
                                    parentsection={parentsection}>{children}</Field>;
                            }
                        )}
                    </Col>
                    <Col>
                        <FieldButton
                            icon="ri-add-line"
                            datatestid="btn-add"
                            onClick={() => setNumber(number + 1)}
                            title={`${title}`}/>
                    </Col>
                </Row>
            </Container>
        </Col>
    );

}

export default InfiniteField;
