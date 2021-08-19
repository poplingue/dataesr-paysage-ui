import { Toggle } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFieldValue, getForm, getFormName, getUniqueId } from '../../helpers/utils';

export default function CustomToggle({ keynumber, parentsection, title }) {
    const { state: { forms }, dispatch } = useContext(AppContext);
    const [checked, setCheched] = useState('none');
    const [init, setInit] = useState(true);
    const { pathname } = useRouter();
    const uniqueId = getUniqueId(pathname, parentsection, title, keynumber);
    const formName = getFormName(pathname);

    useEffect(() => {
        let v = 'false';

        // TODO refacto
        if (getForm(forms, formName) && init) {
            if (getFieldValue(forms, formName, uniqueId)) {
                v = getFieldValue(forms, formName, uniqueId);
            }

            const payload = {
                value: v,
                uid: uniqueId,
                formName,
            };

            dispatch({ type: 'UPDATE_FORM_FIELD', payload });
            setInit(false);
        }
    }, [forms, uniqueId, init, dispatch]);

    useEffect(() => {
        if (!init) {
            if (getFieldValue(forms, formName, uniqueId)) {
                setCheched(getFieldValue(forms, formName, uniqueId));
            }
        }
    }, [formName, forms, init, uniqueId]);

    const onToggleChange = (e) => {
        const payload = {
            value: e.target.checked ? 'true' : 'false',
            uid: uniqueId,
            formName,
        };
        dispatch({ type: 'UPDATE_FORM_FIELD', payload });
        setCheched(!checked);
    };


    return <Toggle
        data-field={uniqueId}
        data-cy={uniqueId}
        onChange={(e) => onToggleChange(e)}
        isChecked={checked === 'true'}
        label={title}
    />;
}
