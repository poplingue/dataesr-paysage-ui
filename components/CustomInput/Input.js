import { TextInput } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFieldValue, getFormName, getUniqueId } from '../../helpers/utils';
import useValidator from '../../hooks/useValidator';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';

function Input({
    label,
    index,
    subObject,
    value: initValue,
    validatorConfig,
    updateValidSection,
    validatorId,
}) {
    const {
        stateForm: { forms, storeObjects, updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const { checkField, message, type } = useValidator(validatorConfig);
    const [textValue, setTextValue] = useState(initValue || '');

    const inputRef = useRef(initValue || '');
    // TODO put in globals ?
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, validatorId, index);

    const saveValue = useCallback(
        async (value) => {
            const checkStoreObject = storeObjects.indexOf(formName) > -1;
            const payload = {
                value,
                uid,
                formName,
            };

            dispatch({ type: 'UPDATE_FORM_FIELD', payload });

            if (checkStoreObject) {
                await DBService.set(
                    {
                        value,
                        uid,
                    },
                    formName
                );
            }

            if (!value) {
                dispatch({ type: 'DELETE_FORM_FIELD', payload });
                await DBService.delete(uid, formName);
                NotifService.techInfo('Input field deleted');
            }
        },
        [dispatch, formName, storeObjects, uid, updateObjectId]
    );

    const onChange = async (e) => {
        const { value } = e.target;
        checkField(value);
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
        checkField(textValue || '');
    }, [checkField, textValue]);

    useEffect(() => {
        const current = getFieldValue(forms, formName, uid);

        if (current && textValue !== current) {
            setTextValue(current);
        }
    }, [formName, forms, textValue, uid]);

    useEffect(() => {
        updateValidSection(uid, type);
    }, [type, uid, updateValidSection]);

    return (
        <>
            <TextInput
                message={message}
                messageType={type}
                data-field={uid}
                data-testid={validatorId}
                ref={inputRef}
                onChange={onChange}
                value={textValue}
                hint={`${!validatorConfig.required ? '(optionnel)' : ''}`}
                label={label}
            />
        </>
    );
}

Input.defaultProps = {
    value: '',
    index: '',
    updateValidSection: () => {},
};

Input.propTypes = {
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
