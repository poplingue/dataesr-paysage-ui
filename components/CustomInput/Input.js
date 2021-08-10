import { useEffect, useRef, useState } from 'react';
import { TextInput } from '@dataesr/react-dsfr';
import { AppContext } from '../../context/GlobalState';
import { useContext } from 'react';
import { getFormName, getUniqueId } from '../../helpers/utils';
import { useRouter } from 'next/router';

function Input({ label, keyNumber, parentSection }) {
    const { state, dispatch } = useContext(AppContext);
    const inputRef = useRef(null);
    const router = useRouter();
    // TODO dynamic
    const uniqueId = getUniqueId(router.pathname, parentSection, label, keyNumber);
    const [textValue, setTextValue] = useState('');
    const saveValue = (e) => {
        // TODO dataAtt needed??
        // TODO manage if value=''
        dispatch({
            type: 'UPDATE_FORM_FIELD',
            payload: { value: e.target.value, uid: uniqueId, name: getFormName(router.pathname), dataAtt: uniqueId }
        });
        setTextValue(e.target.value);
    };
    useEffect(() => {
        if (state.objectStoreName && !textValue && state.forms[state.objectStoreName]) {
            setTextValue(state.forms[state.objectStoreName][uniqueId]);
        }
    }, [state.forms, state.objectStoreName, textValue, uniqueId]);
    return (
        <>
            <TextInput
                data-field={uniqueId}
                ref={inputRef}
                onChange={(e) => saveValue(e, inputRef)}
                value={textValue || ''}
                label={label}
            />
            {/*// TODO Button delete field*/}
        </>
    );

}

export default Input;