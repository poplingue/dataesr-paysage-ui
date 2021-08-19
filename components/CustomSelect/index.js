import { Select } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getUrl } from '../../helpers/constants';
import { getFieldValue, getForm, getFormName, getUniqueId } from '../../helpers/utils';

export default function CustomSelect({ title, staticValues = [], keynumber, parentsection }) {
    const { state: { forms }, dispatch } = useContext(AppContext);
    const [options, setOptions] = useState([]);
    const [selectValue, setSelectValue] = useState('');
    const { pathname } = useRouter();
    const uniqueId = getUniqueId(pathname, parentsection, title, keynumber || 0);
    const formName = getFormName(pathname);

    const onSelectChange = (e) => {
        const value = e.target.value;
        const payload = {
            value,
            uid: uniqueId,
            formName,
        };

        if (e.target.value) {
            dispatch({ type: 'UPDATE_FORM_FIELD', payload });
        } else {
            dispatch({ type: 'DELETE_FORM_FIELD', payload });
        }

        setSelectValue(value);
    };

    useEffect(() => {
        // TODO refacto same elsewhere

        if (formName && !selectValue && getForm(forms, formName)) {
            setSelectValue(getFieldValue(forms, formName, uniqueId));
        }
    }, [formName, forms, selectValue, uniqueId]);

    useEffect(() => {
        if (!staticValues.length && !options.length) {
            // case no static values
            fetch(getUrl(title))
                .then(res => res.json())
                .then(() => {
                    // fake data
                    const obj = ['f', 'm', 'n'].map((s) => {
                        return { value: s, label: s };
                    });
                    setOptions(obj);
                });
        } else if (!options.length) {
            setOptions(staticValues.map((value) => {
                return { 'value': value, 'label': value };
            }));
            setOptions(prev => [...prev, { value: '', label: 'Select an option' }]);
        }
    }, [options, setOptions, staticValues, title]);

    return (
        <section className="wrapper-select py-10">
            <Select
                data-field={uniqueId}
                data-testid={uniqueId}
                onChange={(e) => onSelectChange(e)}
                selected={selectValue}
                label={title}
                options={options}
            />
        </section>
    );
}
