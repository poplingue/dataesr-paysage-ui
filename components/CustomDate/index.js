import { Select } from '@dataesr/react-dsfr';
import { getFormName, getUniqueId, range } from '../../helpers/utils';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '../../context/GlobalState';

export default function CustomDate({ title, parentSection, keyNumber }) {
    const { state, dispatch } = useContext(AppContext);
    const [day, setDay] = useState('');
    const router = useRouter();
    const uniqueId = getUniqueId(router.pathname, parentSection, title, keyNumber || 0);
    const days = range(1, 31);
    const months = range(1, 12);
    const years = range(1900, 2021);

    const onDayChange = (e) => {
        // TODO manage if value=''
        dispatch({
            type: 'UPDATE_FORM_FIELD',
            payload: { value: e.target.value, uid: uniqueId, name: getFormName(router.pathname), dataAtt: uniqueId }
        });
        setDay(e.target.value);
    };
    useEffect(() => {
        if (state.objectStoreName && !day && state.forms[state.objectStoreName]) {
            setDay(state.forms[state.objectStoreName][uniqueId]);
        }
    }, [state.forms, state.objectStoreName, day, uniqueId]);
    const daysOptions = days.map((day) => {
        return { label: day.toString(), value: day.toString() };
    });
    return <section className="wrapper-select py-10">
        <Select
            data-field={uniqueId}
            onChange={(e) => onDayChange(e)}
            selected={day}
            label={`${title} day`}
            options={[...daysOptions, { value: '', label: 'Select a day', disabled: true }]}
        />
    </section>;
}
