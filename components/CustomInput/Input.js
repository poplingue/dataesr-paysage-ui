import { TextInput } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import {
    getFieldValue,
    getFormName,
    getUniqueId,
    isFieldUnSaved,
} from '../../helpers/utils';
import useValidator from '../../hooks/useValidator';
import DBService from '../../services/DB.service';
import WrapperField from '../WrapperField';

function Input({
    label,
    index,
    subObject,
    infinite = false,
    value: initValue,
    validatorConfig,
    updateValidSection,
    validatorId,
}) {
    const {
        stateForm: { forms, storeObjects },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const { checkField, message, type } = useValidator(validatorConfig);
    const [textValue, setTextValue] = useState(initValue || '');

    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(
        formName,
        subObject,
        validatorId,
        infinite ? index : null
    );

    const currentValue = getFieldValue(forms, formName, uid);
    const unSaved = isFieldUnSaved(forms, formName, uid);

    const saveValue = useCallback(
        async (value) => {
            const checkStoreObject = storeObjects.indexOf(formName) > -1;

            const payload = {
                value,
                uid,
                infinite,
                unSaved: true,
            };

            dispatch({
                type: 'UPDATE_FORM_FIELD',
                payload: { ...payload, formName },
            });

            // TODO add unSaved Radio
            if (checkStoreObject) {
                await DBService.set(payload, formName);
            }
        },
        [dispatch, formName, infinite, storeObjects, uid]
    );

    const onChange = async (e) => {
        const { value } = e.target;
        checkField({ value });
        setTextValue(value);
        updateValidSection(null, null);

        await saveValue(value);
    };

    useEffect(() => {
        if (!textValue) {
            setTextValue(initValue);
        }
    }, [textValue, initValue]);

    useEffect(() => {
        if (!textValue && initValue) {
            setTextValue(initValue);
        }
    }, [textValue, initValue]);

    useEffect(() => {
        // init check validity field
        checkField({ value: textValue || '' });
    }, [checkField, textValue]);

    useEffect(() => {
        if (textValue !== currentValue) {
            setTextValue(currentValue);
        }
    }, [currentValue, formName, forms, textValue, uid]);

    useEffect(() => {
        updateValidSection(uid, type);
    }, [type, uid, updateValidSection]);

    return (
        <WrapperField unSaved={unSaved}>
            <TextInput
                message={message}
                messageType={type}
                data-field={uid}
                data-testid={validatorId}
                onChange={onChange}
                value={textValue}
                hint={`${!validatorConfig.required ? '(optionnel)' : ''}`}
                label={label}
            />
        </WrapperField>
    );
}

Input.defaultProps = {
    value: '',
    index: 0,
    infinite: false,
    updateValidSection: () => {},
};

Input.propTypes = {
    infinite: PropTypes.bool,
    label: PropTypes.string.isRequired,
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.string,
    validatorConfig: PropTypes.shape({
        required: PropTypes.bool,
        validators: PropTypes.arrayOf(PropTypes.func),
    }).isRequired,
    updateValidSection: PropTypes.func,
};

export default Input;
