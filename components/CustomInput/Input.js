import { useEffect, useRef, useState } from 'react';
import { TextInput } from '@dataesr/react-dsfr';
import { AppContext } from '../../context/GlobalState';
import { useContext } from 'react';
import { getUniqueId } from '../../helpers/utils';
import { useRouter } from 'next/router';

function Input({ label, keynumber, title, parentsection, value = '' }) {
    const { state: { forms, objectStoreName, formName }, dispatch } = useContext(AppContext);
    const inputRef = useRef(null);
    const { pathname } = useRouter();
    // TODO dynamic
    const uniqueId = getUniqueId(pathname, parentsection, title, keynumber);
    const [textValue, setTextValue] = useState(value);
    const saveValue = (e) => {
        const value = e.target.value;
        const payload = {
            value,
            uid: uniqueId,
            formName
        };
        setTextValue(value);
        dispatch({ type: 'UPDATE_FORM_FIELD', payload });
    };
    useEffect(() => {
        if (objectStoreName && forms[objectStoreName]) {
            setTextValue(forms[objectStoreName][uniqueId]);
        }
    }, [forms, objectStoreName, textValue, uniqueId, title, keynumber]);
    return (
        <>
            <TextInput
                data-field={uniqueId}
                ref={inputRef}
                onChange={(e) => saveValue(e, inputRef)}
                value={textValue || ''}
                label={label}
            />
        </>
    );

}

export default Input;
