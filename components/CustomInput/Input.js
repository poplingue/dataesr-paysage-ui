import { useEffect, useRef, useState } from 'react';
import { TextInput } from '@dataesr/react-dsfr';
import { AppContext } from '../../context/GlobalState';
import { useContext } from 'react';
import { getFormName, getUniqueId } from '../../helpers/utils';
import { useRouter } from 'next/router';

function Input({ label, keyNumber, title, parentSection, value = '' }) {
    const { state, dispatch } = useContext(AppContext);
    const inputRef = useRef(null);
    const router = useRouter();
    // TODO dynamic
    const uniqueId = getUniqueId(router.pathname, parentSection, title, keyNumber);
    const [textValue, setTextValue] = useState(value);
    const saveValue = (e) => {
        const value = e.target.value;
        const payload = {
            value,
            uid: uniqueId,
            formName: getFormName(router.pathname)
        };
        setTextValue(value);
        dispatch({ type: 'UPDATE_FORM_FIELD', payload });
    };
    useEffect(() => {
        if (state.objectStoreName && state.forms[state.objectStoreName]) {
            setTextValue(state.forms[state.objectStoreName][uniqueId]);
        }
    }, [state.forms, state.objectStoreName, textValue, uniqueId, title, keyNumber]);
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
