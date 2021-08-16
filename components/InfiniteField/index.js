import FieldButton from '../FieldButton';
import { Col } from '@dataesr/react-dsfr';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getUniqueId } from '../../helpers/utils';
import { useRouter } from 'next/router';
import Field from '../Field';

function InfiniteField({ children, title, parentsection }) {
    const { state: { forms, formName }, dispatch } = useContext(AppContext);
    const [number, setNumber] = useState(0);
    const { pathname } = useRouter();
    const deleteField = (index) => {
        if (number > 2) {
            // TODO refacto??
            for (let i = 0; i <= number; i = i + 1) {
                if (i > index && i < number) {
                    dispatch({
                        type: 'UPDATE_FORM_FIELD', payload: {
                            formName,
                            value: forms[formName][getUniqueId(pathname, parentsection, title, i)],
                            uid: getUniqueId(pathname, parentsection, title, i - 1)
                        }
                    });
                }

                if (i === number) {
                    const payload = {
                        uid: getUniqueId(pathname, parentsection, title, i - 1),
                        formName,
                    };
                    dispatch({ type: 'DELETE_FORM_FIELD', payload });
                }
            }
        } else {
            const payload = {
                uid: getUniqueId(pathname, parentsection, title, index),
                formName,
            };
            dispatch({ type: 'DELETE_FORM_FIELD', payload });
        }

        setNumber(number - 1);
    };
    useEffect(() => {
        if (formName) {
            const initInfinite = Object.entries(forms[formName]).filter(([k]) => k.startsWith(getUniqueId(pathname, parentsection, title)));
            setNumber(initInfinite.length || 1);
        }
    }, [forms, title, parentsection, formName, pathname]);
    return (<Col n="12">
            {Array.apply(null, { length: number }).map((v, i) => {
                    const value = forms[formName] ? forms[formName][getUniqueId(pathname, parentsection, title, i)] : null;
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
                <FieldButton datatestid='btn-add' onClick={() => setNumber(number + 1)} title={`Add 1 ${title}`}/>
            </Col>
        </Col>
    );

}

export default InfiniteField;
