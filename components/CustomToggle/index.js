import { Toggle } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import {
    getFieldValue,
    getForm,
    getFormName,
    getUniqueId,
} from '../../helpers/utils';
import DBService from '../../services/DB.service';

function CustomToggle({ subObject, title, validatorId }) {
    const {
        stateForm: { forms, storeObjects },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const [checked, setCheched] = useState('none');
    const [init, setInit] = useState(true);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uniqueId = getUniqueId(formName, subObject, validatorId);
    const toggleValue = getFieldValue(forms, formName, uniqueId);

    useEffect(() => {
        const checkStoreObject = storeObjects.indexOf(formName) > -1;
        let defaultLabel = 'false';

        if (init && getForm(forms, formName)) {
            if (toggleValue) {
                defaultLabel = toggleValue;
            }

            const payload = {
                value: defaultLabel,
                uid: uniqueId,
                formName,
            };

            dispatch({ type: 'UPDATE_FORM_FIELD', payload });
            setInit(false);

            const updateIndexDB = async () => {
                await DBService.set(
                    {
                        value: defaultLabel,
                        uid: uniqueId,
                    },
                    formName
                );
            };

            if (checkStoreObject) {
                updateIndexDB();
            }
        }
    }, [dispatch, formName, forms, init, storeObjects, toggleValue, uniqueId]);

    useEffect(() => {
        if (!init) {
            if (toggleValue) {
                setCheched(toggleValue);
            }
        }
    }, [init, toggleValue]);

    const onToggleChange = async (e) => {
        const checkStoreObject = storeObjects.indexOf(formName) > -1;
        const payload = {
            value: e.target.checked ? 'true' : 'false',
            uid: uniqueId,
            formName,
        };

        dispatch({ type: 'UPDATE_FORM_FIELD', payload });
        setCheched(!checked);

        if (checkStoreObject) {
            await DBService.set(
                {
                    value: e.target.checked ? 'true' : 'false',
                    uid: uniqueId,
                },
                formName
            );
        }
    };

    return (
        <Toggle
            data-field={uniqueId}
            data-cy={uniqueId}
            onChange={(e) => onToggleChange(e)}
            checked={checked === 'true'}
            label={title}
        />
    );
}

CustomToggle.propTypes = {
    subObject: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    validatorId: PropTypes.string.isRequired,
};

export default CustomToggle;
