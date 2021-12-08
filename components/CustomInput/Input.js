import { TextInput } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFieldValue, getFormName, getUniqueId } from '../../helpers/utils';
import useValidator from '../../hooks/useValidator';
import DBService from '../../services/DB.service';

function Input({
    label,
    index,
    title,
    section,
    value = '',
    validatorConfig,
    updateValidSection,
}) {
    const {
        stateForm: { forms, storeObjects, validSections },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const { checkField, message, type } = useValidator(validatorConfig);
    const [textValue, setTextValue] = useState(value);

    const inputRef = useRef(null);
    // TODO put in globals ?
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, section, title, index);
    const inputValue = getFieldValue(forms, formName, uid);

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
        },
        [dispatch, formName, storeObjects, uid]
    );

    const onChange = async (e) => {
        const { value } = e.target;
        checkField(value);
        setTextValue(value);
        updateValidSection(null, null);
    };

    useEffect(() => {
        async function save() {
            await saveValue(textValue, inputRef);
        }

        const current = getFieldValue(forms, formName, uid);

        if (textValue !== current) {
            save();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [textValue]);

    useEffect(() => {
        // check fields validity on init
        checkField(inputValue || '');

        if (inputValue) {
            setTextValue(inputValue);
        }
    }, [checkField, inputValue]);

    useEffect(() => {
        updateValidSection(uid, type);
    }, [type, uid, updateValidSection]);

    return (
        <>
            <TextInput
                message={message}
                messageType={type}
                data-field={uid}
                data-testid={title}
                ref={inputRef}
                onChange={onChange}
                value={textValue || ''}
                hint={`${!validatorConfig.required ? '(optionnel)' : ''}`}
                label={label}
            />
        </>
    );
}

Input.defaultProps = {
    value: '',
};

Input.propTypes = {
    label: PropTypes.string.isRequired,
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    value: PropTypes.string,
    validatorConfig: PropTypes.shape({
        required: PropTypes.bool,
        validators: PropTypes.arrayOf(PropTypes.func),
    }).isRequired,
    updateValidSection: PropTypes.func,
};

export default Input;
