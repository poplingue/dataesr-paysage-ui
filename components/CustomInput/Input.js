import { TextInput } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { configValidators } from '../../config/objects';
import { AppContext } from '../../context/GlobalState';
import {
    getFieldValue,
    getFormName,
    getSectionName,
    getSubObjectType,
    getUniqueId,
    isFieldUnSaved,
} from '../../helpers/utils';
import useValidator from '../../hooks/useValidator';
import DBService from '../../services/DB.service';
import SavingWrapper from '../SavingWrapper';
import Suggest from '../Suggest';

function Input({
    label,
    hint,
    index,
    subObject,
    infinite = false,
    value: initValue,
    onGroupChange,
    updateValidSection,
    validatorId,
    suggest = false,
    customOnChange,
}) {
    const {
        stateForm: { forms, storeObjects },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const {
        pathname,
        query: { object },
    } = useRouter();

    const validatorConfig = object
        ? configValidators[object][getSubObjectType(subObject)][validatorId]
        : null;

    const { checkField, message, type } = useValidator(validatorConfig);
    const [textValue, setTextValue] = useState(initValue || '');
    const [focus, setFocus] = useState(false);

    const formName = getFormName(pathname, object);
    const uid = getUniqueId(
        formName,
        subObject,
        validatorId,
        infinite ? index : null
    );

    const currentValue = useMemo(
        () => getFieldValue(forms, formName, uid),
        [formName, forms, uid]
    );
    const unSaved = useMemo(
        () => isFieldUnSaved(forms, formName, uid),
        [formName, forms, uid]
    );

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
        setFocus(true);

        if (onGroupChange) {
            onGroupChange(e, uid);
        } else {
            await saveValue(value);
        }

        if (customOnChange) {
            // case input Date
            customOnChange(value, { fullDateOnly: true });
        }

        // section is unSaved
        dispatch({
            type: 'ADD_SAVING_SECTION',
            payload: { section: getSectionName(uid) },
        });
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
        // set value from GlobalState
        if (textValue !== currentValue) {
            setTextValue(currentValue);
        }
    }, [currentValue, formName, forms, textValue, uid]);

    useEffect(() => {
        updateValidSection(uid, type);
    }, [customOnChange, textValue, type, uid, updateValidSection]);

    const renderTextInput = (
        <TextInput
            onBlur={() => setFocus(false)}
            onChange={onChange}
            message={message}
            messageType={type}
            data-field={uid}
            data-testid={validatorId}
            value={textValue}
            hint={
                hint ||
                `${
                    validatorConfig && !validatorConfig.required
                        ? '(optionnel)'
                        : ''
                }`
            }
            label={label}
        />
    );

    return (
        <SavingWrapper unSaved={unSaved}>
            <Suggest
                focus={focus}
                subObject={subObject}
                suggest={suggest}
                value={textValue}
                validatorId={validatorId}
                onChange={onChange}
            >
                {renderTextInput}
            </Suggest>
        </SavingWrapper>
    );
}

Input.defaultProps = {
    value: '',
    index: 0,
    infinite: false,
    suggest: false,
    updateValidSection: () => {},
};

Input.propTypes = {
    suggest: PropTypes.bool,
    infinite: PropTypes.bool,
    label: PropTypes.string.isRequired,
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.string,
    updateValidSection: PropTypes.func,
};

export default Input;
