import { Select } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getUrl } from '../../helpers/constants';
import {
    getFieldValue,
    getForm,
    getFormName,
    getUniqueId,
} from '../../helpers/utils';
import useValidator from '../../hooks/useValidator';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';

export default function CustomSelect({
    title,
    staticValues = [],
    index,
    section,
    newValue,
    newValueCheck,
    validatorConfig,
    updateValidSection,
    updateCheck,
    validatorId,
}) {
    const {
        stateForm: { forms, storeObjects, updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const [options, setOptions] = useState([]);
    const [selectValue, setSelectValue] = useState(newValue || '');
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, section, title, index || 0);

    const { checkField, message, type } = useValidator(validatorConfig);

    const onSelectChange = useCallback(
        async (value) => {
            // TODO manage select empty?
            const checkStoreObject = storeObjects.indexOf(formName) > -1;
            const payload = {
                value,
                uid,
                formName,
            };

            if (value) {
                dispatch({ type: 'UPDATE_FORM_FIELD', payload });

                if (checkStoreObject) {
                    await DBService.set(payload, formName);
                }
            } else {
                dispatch({ type: 'DELETE_FORM_FIELD', payload });
                // TODO Make it async
                await DBService.delete(uid, formName);
                NotifService.techInfo('Select field deleted');
            }
        },
        [dispatch, formName, storeObjects, uid]
    );

    useEffect(() => {
        if (newValue && newValueCheck) {
            onSelectChange(newValue);
            updateCheck(false);
        }
    }, [onSelectChange, newValueCheck, newValue, updateCheck]);

    useEffect(() => {
        const fieldValue = getFieldValue(forms, formName, uid);
        const mustBeUpdated = selectValue !== fieldValue;

        if (
            !updateObjectId &&
            formName &&
            getForm(forms, formName) &&
            (!selectValue || mustBeUpdated)
        ) {
            checkField(fieldValue, 'silent');
            setSelectValue(fieldValue);
        }
    }, [checkField, formName, forms, selectValue, uid]);

    useEffect(() => {
        if (!staticValues.length && !options.length) {
            // case no static values
            // TODO rto emove
            fetch(getUrl(title))
                .then((res) => res.json())
                .then(() => {
                    // fake data
                    const obj = ['f', 'm', 'n'].map((s) => {
                        return { value: s, label: s };
                    });

                    obj.push({
                        value: '',
                        label: 'Sélectionnez une option',
                        disabled: false,
                    });
                    setOptions(obj);
                });
        } else if (!options.length) {
            setOptions(
                staticValues.map((value) => {
                    return { value: value, label: value };
                })
            );
            setOptions((prev) => [
                ...prev,
                { value: '', label: 'Select an option' },
            ]);
        }
    }, [options, setOptions, staticValues, title]);

    const onChange = async (e) => {
        const { value } = e.target;
        checkField(value);
        await onSelectChange(value);
        setSelectValue(value);
        updateValidSection(null, null);
    };

    useEffect(() => {
        updateValidSection(uid, type);
    }, [type, uid, updateValidSection]);

    return (
        <section className="wrapper-select">
            <Select
                message={message}
                messageType={type || undefined}
                data-field={uid}
                data-testid={getUniqueId(
                    formName,
                    section,
                    validatorId,
                    index || 0
                )}
                onChange={onChange}
                selected={selectValue || newValue}
                hint={`${!validatorConfig.required ? '(optionnel)' : ''}`}
                label={title}
                options={options}
            />
        </section>
    );
}

CustomSelect.defaultProps = {
    index: '',
    newValue: '',
    newValueCheck: false,
    updateCheck: () => {},
    updateValidSection: () => {},
};
CustomSelect.propTypes = {
    title: PropTypes.string.isRequired,
    staticValues: PropTypes.arrayOf(PropTypes.string),
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    section: PropTypes.string.isRequired,
    newValue: PropTypes.string,
    newValueCheck: PropTypes.bool,
    validatorConfig: PropTypes.shape({
        required: PropTypes.bool,
        validators: PropTypes.arrayOf(PropTypes.func),
    }).isRequired,
    updateValidSection: PropTypes.func.isRequired,
    updateCheck: PropTypes.func,
};
