import { useEffect, useRef, useState } from 'react';
import { TextInput } from '@dataesr/react-dsfr';
import { AppContext } from '../../context/GlobalState';
import { useContext } from 'react';
import { cleanString } from '../../helpers/utils';

function Input({ label, keyNumber = 0 }) {
    const { state, dispatch } = useContext(AppContext);
    const inputRef = useRef(null);
    const uniqueId = `person-create-${cleanString(label)}-${keyNumber}`;
    const [textValue, setTextValue] = useState( '');
    const saveValue = (e) => {
        // TODO dataAtt needed??
        dispatch({
            type: 'UPDATE_FORM',
            payload: { value: e.target.value, uid: uniqueId, name: 'person', dataAtt: uniqueId }
        });
        setTextValue(e.target.value);
    };
    useEffect(()=>{
        if(state.objectStoreName && !textValue){
            setTextValue(state.forms[state.objectStoreName][uniqueId])
        }
    },[state.forms, state.objectStoreName, textValue, uniqueId])
    return (
        <TextInput
            data-field={uniqueId}
            ref={inputRef}
            onChange={(e) => saveValue(e, inputRef)}
            value={textValue}
            label={label}
        />);
}

export default Input;