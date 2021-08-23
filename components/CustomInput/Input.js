import { TextInput } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFieldValue, getFormName, getUniqueId } from '../../helpers/utils';
import DBService from '../../services/DBService';

function Input({ label, keynumber, title, parentsection, value = '' }) {
    const { state: { forms, storeObjects }, dispatch } = useContext(AppContext);
    const [textValue, setTextValue] = useState(value);
    const inputRef = useRef(null);
    const { pathname } = useRouter();
    const uniqueId = getUniqueId(pathname, parentsection, title, keynumber);
    const formName = getFormName(pathname);
    const inputValue = getFieldValue(forms, formName, uniqueId)

    const saveValue = async (e) => {
        const value = e.target.value;
        const checkStoreObject = storeObjects.indexOf(formName) > -1;
        const payload = {
            value,
            uid: uniqueId,
            formName,
        };
        setTextValue(value);
        dispatch({ type: 'UPDATE_FORM_FIELD', payload });

        if (checkStoreObject) {
            await DBService.set({
                value,
                uid: uniqueId,
            }, formName);

        }
    };

    useEffect(() => {
        if (inputValue) {
            setTextValue(inputValue);
        }
    }, [inputValue]);

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
