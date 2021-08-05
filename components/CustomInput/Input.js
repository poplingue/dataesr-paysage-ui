import { useRef, useState } from 'react';
import { TextInput } from '@dataesr/react-dsfr';
import { AppContext } from '../../context/GlobalState';
import { useContext } from 'react';
import { cleanString } from '../../helpers/utils';

function Input({ label, keyNumber = 0 }) {
    const { dispatch } = useContext(AppContext);
    const [textValue, setTextValue] = useState('');
    const inputRef = useRef(null);
    const uniqueId = `person-create-${cleanString(label)}-${keyNumber}`;
    const saveValue = (e) => {
        dispatch({ type: 'UPDATE_FORM', payload: { value: e.target.value, uid: uniqueId, name: 'Person' } });
        setTextValue(e.target.value);
    };
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