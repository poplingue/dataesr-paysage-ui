import { Select } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getUrl } from '../../helpers/constants';
import { getFieldValue, getForm, getFormName, getUniqueId } from '../../helpers/utils';
import DBService from '../../services/DBService';
import NotifService from '../../services/NotifService';

export default function CustomSelect({ title, staticValues = [], keynumber, parentsection }) {
    const { state: { forms, storeObjects }, dispatch } = useContext(AppContext);
    const [options, setOptions] = useState([]);
    const [selectValue, setSelectValue] = useState('');
    const { pathname } = useRouter();
    const uid = getUniqueId(pathname, parentsection, title, keynumber || 0);
    const formName = getFormName(pathname);

    const onSelectChange = async (e) => {
        const value = e.target.value;
        const checkStoreObject = storeObjects.indexOf(formName) > -1;
        const payload = {
            value,
            uid,
            formName,
        };

        if (e.target.value) {
            dispatch({ type: 'UPDATE_FORM_FIELD', payload });

            if (checkStoreObject) {
                await DBService.set({
                    value,
                    uid
                }, formName);

            }
        } else {
            dispatch({ type: 'DELETE_FORM_FIELD', payload });
            // TODO Make it async
            await DBService.delete(uid, formName)
            NotifService.info('Select field deleted');
        }

        setSelectValue(value);
    };

    useEffect(() => {
        if (formName && !selectValue && getForm(forms, formName)) {
            setSelectValue(getFieldValue(forms, formName, uid));
        }
    }, [formName, forms, selectValue, uid]);

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
                data-field={uid}
                data-testid={uid}
                onChange={(e) => onSelectChange(e)}
                selected={selectValue}
                label={title}
                options={options}
            />
        </section>
    );
}
