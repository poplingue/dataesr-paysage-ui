import { useEffect, useState } from 'react';
import { Select } from '@dataesr/react-dsfr';
import { getUrl } from '../../helpers/constants';

export default function CustomSelect({ title, staticValues = [] }) {
    const [options, setOptions] = useState([]);
    const [selectValue, setSelectValue] = useState('');

    useEffect(() => {
        if (!staticValues.length && !options.length) {
            fetch(getUrl(title))
                .then(res => res.json())
                .then(json => {
                    const obj = ['f', 'm', 'n'].map((s) => {
                        return { value: s, label: s };
                    });
                    setOptions(obj);
                });
        } else if (!options.length) {
            setOptions(staticValues.map((value) => {
                return { 'value': value, 'label': value };
            }));
        }
    }, [options, setOptions, staticValues, title]);
    return (
        <section className="wrapper-select py-10">
            <Select
                onChange={(e) => setSelectValue(e.target.value)}
                selected={selectValue}
                label={title}
                options={options}
            />
        </section>
    );
}
