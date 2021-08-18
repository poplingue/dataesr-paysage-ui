import { Col } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getField, getForm, getFormName, getUniqueId } from '../../helpers/utils';
import Field from '../Field';
import FieldButton from '../FieldButton';

function InfiniteField({ children, title, parentsection }) {
    const { state: { forms }, dispatch } = useContext(AppContext);
    const [number, setNumber] = useState(0);
    const { pathname } = useRouter();
    const formName = getFormName(pathname);

    const deleteField = (index) => {
        if (number > 2) {
            // TODO refacto??
            for (let i = 0; i <= number; i = i + 1) {
                if (i > index && i < number) {
                    //TODO REFACTO getUniqueID
                    dispatch({
                        type: 'UPDATE_FORM_FIELD', payload: {
                            formName,
                            value: getField(forms, formName, getUniqueId(pathname, parentsection, title, i)),
                            uid: getUniqueId(pathname, parentsection, title, i - 1)
                        }
                    });
                }

                if (i === number) {
                    const payload = {
                        uid: getUniqueId(pathname, parentsection, title, i - 1),
                        formName
                    };
                    dispatch({ type: 'DELETE_FORM_FIELD', payload });
                }
            }
        } else {
            const payload = {
                uid: getUniqueId(pathname, parentsection, title, index),
                formName,
            };
            dispatch({
                type: 'DELETE_FORM_FIELD', payload: {
                    uid: getUniqueId(pathname, parentsection, title, index),
                    formName,
                }
            });
        }

        setNumber(number - 1);
    };

    useEffect(() => {
        const currentForm = getForm(forms, formName);

        if (currentForm) {
            const initInfinite = currentForm.filter((field) => field.uid.startsWith(getUniqueId(pathname, parentsection, title)));
            setNumber(initInfinite.length || 1);
        }
    }, [forms, title, parentsection, formName]);

    return (<Col n="12">
            {Array.apply(null, { length: number }).map((v, i) => {
                    const value = getForm(forms, formName) ? getForm(forms, formName)[getUniqueId(pathname, parentsection, title, i)] : null;
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
            <Col className="py-10">
                <FieldButton datatestid="btn-add" onClick={() => setNumber(number + 1)} title={`Add 1 ${title}`}/>
            </Col>
        </Col>
    );

}

export default InfiniteField;
