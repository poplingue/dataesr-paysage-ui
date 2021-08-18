import { TextInput } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getField, getFormName, getUniqueId } from '../../helpers/utils';

function Input({ label, keynumber, title, parentsection, value = '' }) {
    const { state: { forms }, dispatch } = useContext(AppContext);
    const inputRef = useRef(null);
    const { pathname } = useRouter();
    // TODO dynamic
    const uniqueId = getUniqueId(pathname, parentsection, title, keynumber);
    const [textValue, setTextValue] = useState(value);
    const formName = getFormName(pathname);

    const saveValue = (e) => {
        const value = e.target.value;
        const payload = {
            value,
            uid: uniqueId,
            formName,
        };
        setTextValue(value);
        dispatch({ type: 'UPDATE_FORM_FIELD', payload });
    };

    useEffect(() => {
        if (getField(forms, formName, uniqueId)) {
            setTextValue(getField(forms, formName, uniqueId));
        }
    }, [forms, textValue, uniqueId, title, keynumber]);

    return (
        <>
            <TextInput
                data-field={uniqueId}
                data-testid={title}
                ref={inputRef}
                onChange={(e) => saveValue(e, inputRef)}
                value={textValue || ''}
                label={label}
            />
        </>
    );

}

export default Input;
