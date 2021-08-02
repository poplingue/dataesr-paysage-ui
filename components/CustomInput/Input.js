import { useState } from 'react';
import { TextInput} from '@dataesr/react-dsfr';

function Input({ label }) {
    const [textValue, setTextValue] = useState('');
    return (
        <TextInput
            onChange={(e) => setTextValue(e.target.value)}
            value={textValue}
            label={label}
        />);
}

export default Input;