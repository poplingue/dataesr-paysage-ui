import { Select } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import {
    getFieldValue,
    getForm,
    getFormName,
    getUniqueId,
    isFieldUnSaved,
    matchRegex,
} from '../../helpers/utils';
import useValidator from '../../hooks/useValidator';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import UnSavedField from '../UnSavedField';

export default function CustomSelect({
    title,
    customOnChange,
    staticValues = [],
    newValue,
    newValueCheck,
    validatorConfig,
    updateValidSection,
    validatorId,
    subObject,
}) {
    const {
        stateForm: { forms, storeObjects, updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const [options, setOptions] = useState([]);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, validatorId);
    const fieldValue = getFieldValue(forms, formName, uid);
    const [selectValue, setSelectValue] = useState(
        newValue || fieldValue || ''
    );
    const unSaved = isFieldUnSaved(forms, formName, uid);
    const { checkField, message, type } = useValidator(validatorConfig);

    const updateSelect = useCallback(
        async (payload) => {
            const checkStoreObject = storeObjects.indexOf(formName) > -1;

            dispatch({ type: 'UPDATE_FORM_FIELD', payload });

            if (checkStoreObject) {
                return await DBService.set(payload, formName).then(() => {
                    NotifService.techInfo('Select field updated');
                });
            }
        },
        [dispatch, formName, storeObjects]
    );

    const deleteSelect = useCallback(
        async (payload) => {
            dispatch({ type: 'DELETE_FORM_FIELD', payload });

            await DBService.delete(uid, formName).then(() => {
                NotifService.techInfo('Select field deleted');
            });
        },
        [dispatch, formName, uid]
    );

    const dispatchSelect = useMemo(() => {
        return {
            true: (payload) => updateSelect(payload),
            false: (payload) => deleteSelect(payload),
        };
    }, [deleteSelect, updateSelect]);

    const onSelectChange = useCallback(
        async (value) => {
            const payload = {
                value,
                uid,
                formName,
                unSaved: true,
            };

            dispatchSelect[!!value](payload);
        },
        [dispatchSelect, formName, uid]
    );

    const onChangeObj = useMemo(() => {
        return {
            true: (value, updateCheck) => customOnChange(value, updateCheck),
            false: (value) => onSelectChange(value),
        };
    }, [customOnChange, onSelectChange]);

    const handleValue = useCallback(
        (value) => {
            checkField({ value, mode: 'silent' });
            setSelectValue(value);
        },
        [checkField]
    );

    useEffect(() => {
        if (newValue !== undefined && newValueCheck) {
            onChangeObj[!!customOnChange](newValue, false);
        }
    }, [onSelectChange, newValueCheck, newValue, onChangeObj, customOnChange]);

    useEffect(() => {
        const mustBeUpdated = selectValue !== fieldValue;

        const handleValueObj = {
            true: (value) => handleValue(value),
            false: () => '',
        };
        const check =
            (!updateObjectId &&
                formName &&
                getForm(forms, formName) &&
                !selectValue) ||
            mustBeUpdated;

        handleValueObj[check](fieldValue);
    }, [
        fieldValue,
        formName,
        forms,
        handleValue,
        newValue,
        selectValue,
        uid,
        updateObjectId,
    ]);

    useEffect(() => {
        if (!options.length) {
            setOptions(
                staticValues.map((value) => {
                    return { value: value, label: value };
                })
            );
            setOptions((prev) => [
                ...prev,
                { value: '', label: 'Sélectionnez...', disabled: true },
            ]);
        }
    }, [options, setOptions, staticValues, title]);

    const onChange = (e) => {
        const { value } = e.target;
        onChangeObj[!!customOnChange](value);
        handleValue(value);
        updateValidSection(null, null);
    };

    useEffect(() => {
        updateValidSection(uid, type);
    }, [type, uid, updateValidSection]);

    return (
        <UnSavedField
            unSaved={unSaved}
            inline={matchRegex(`Day|Year|Month$`, uid)}
        >
            <section className="wrapper-select">
                <Select
                    message={message}
                    messageType={type || undefined}
                    data-field={uid}
                    onChange={onChange}
                    selected={
                        fieldValue ||
                        (newValue !== undefined ? newValue : selectValue)
                    }
                    hint={`${!validatorConfig.required ? '(optionnel)' : ''}`}
                    label={title}
                    options={options}
                />
            </section>
        </UnSavedField>
    );
}

CustomSelect.defaultProps = {
    newValue: undefined,
    newValueCheck: false,
    customOnChange: undefined,
    updateValidSection: () => {},
};
CustomSelect.propTypes = {
    title: PropTypes.string.isRequired,
    staticValues: PropTypes.arrayOf(PropTypes.string),
    subObject: PropTypes.string.isRequired,
    newValue: PropTypes.string,
    newValueCheck: PropTypes.bool,
    validatorConfig: PropTypes.shape({
        required: PropTypes.bool,
        validators: PropTypes.arrayOf(PropTypes.func),
    }).isRequired,
    updateValidSection: PropTypes.func.isRequired,
    customOnChange: PropTypes.func,
};
