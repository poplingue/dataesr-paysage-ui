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
} from '../../helpers/utils';
import useValidator from '../../hooks/useValidator';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';

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

    const { checkField, message, type } = useValidator(validatorConfig);

    const onSelectChange = useCallback(
        async (value) => {
            // TODO manage select empty?
            const checkStoreObject = storeObjects.indexOf(formName) > -1;
            const payload = {
                value,
                uid,
                formName,
                unSaved: true,
            };

            if (value) {
                dispatch({ type: 'UPDATE_FORM_FIELD', payload });

                if (checkStoreObject) {
                    await DBService.set(payload, formName).then(() => {
                        NotifService.techInfo('Select field updated');
                    });
                }
            } else {
                dispatch({ type: 'DELETE_FORM_FIELD', payload });

                await DBService.delete(uid, formName).then(() => {
                    NotifService.techInfo('Select field deleted');
                });
            }
        },
        [dispatch, formName, storeObjects, uid]
    );

    const onChangeObj = useMemo(() => {
        return {
            true: (value, updateCheck) => customOnChange(value, updateCheck),
            false: (value) => onSelectChange(value),
        };
    }, [customOnChange, onSelectChange]);

    const handleValue = useCallback(
        (value) => {
            checkField(value, 'silent');
            setSelectValue(value);
        },
        [checkField]
    );

    useEffect(() => {
        if (newValue && newValueCheck) {
            onChangeObj[!!customOnChange](newValue, false);
        }
    }, [onSelectChange, newValueCheck, newValue, onChangeObj, customOnChange]);

    useEffect(() => {
        const fieldValue = getFieldValue(forms, formName, uid);
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

        handleValueObj[check](fieldValue || selectValue);
    }, [
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
                { value: '', label: 'Select an option' },
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
        <section className="wrapper-select">
            <Select
                message={message}
                messageType={type || undefined}
                data-field={uid}
                onChange={onChange}
                selected={fieldValue || newValue || selectValue}
                hint={`${!validatorConfig.required ? '(optionnel)' : ''}`}
                label={title}
                options={options}
            />
        </section>
    );
}

CustomSelect.defaultProps = {
    newValue: '',
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
