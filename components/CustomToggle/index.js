import { Toggle } from '@dataesr/react-dsfr';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUniqueId } from '../../helpers/utils';
import { AppContext } from '../../context/GlobalState';

export default function CustomToggle({ keyNumber, parentSection, title }) {
    const { state: { formName, forms = {} }, dispatch } = useContext(AppContext);
    const [checked, setCheched] = useState('none');
    const [init, setInit] = useState(true);
    const { pathname } = useRouter();
    const uniqueId = getUniqueId(pathname, parentSection, title, keyNumber);

    useEffect(() => {
        // TODO refacto forms ===> []
        if (formName && Object.keys(forms).length > 0 && !init) {
            if (Object.keys(forms[formName]).length > 0) {
                setCheched(forms[formName][uniqueId]);
            }
        }
    }, [formName, forms, init, uniqueId]);
    useEffect(() => {
        let v = 'false';
        if (forms && init) {
            if (formName && Object.keys(forms[formName]).length > 0) {
                if (forms[formName][uniqueId]) {
                    v = forms[formName][uniqueId];
                }
                const payload = {
                    value: v,
                    uid: uniqueId,
                    formName,
                };

                dispatch({ type: 'UPDATE_FORM_FIELD', payload });
                setInit(false);
            }
        }
    }, [forms, formName, uniqueId, init, dispatch]);

    useEffect(() => {

    }, []);

    const onToggleChange = (e) => {
        const payload = {
            value: e.target.checked ? 'true' : 'false',
            uid: uniqueId,
            formName
        };
        dispatch({ type: 'UPDATE_FORM_FIELD', payload });
        setCheched(!checked);
    };
    return <Toggle
        data-field={uniqueId}
        onChange={(e) => onToggleChange(e)}
        isChecked={checked === 'true'}
        label={title}
    />;
}
