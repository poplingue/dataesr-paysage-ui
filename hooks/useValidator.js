import { useCallback, useState } from 'react';

const init = {
    message: '',
    type: '',
    required: false,
    validators: [
        () => ({
            valid: true,
            errorMsg: '',
        }),
    ],
};

const useValidator = (validatorConfig = init) => {
    const [validInfos, setValidInfos] = useState(init);
    const { required } = validatorConfig;

    const checkField = useCallback(
        ({ value = '', mode }) => {
            const valid = validatorConfig.validators
                ? validatorConfig.validators[0](value).valid
                : true;
            let message = validatorConfig.validators
                ? validatorConfig.validators[0](value).errorMsg
                : '';

            // TODO refacto sort valid/error
            let type = 'error';

            if (!valid) {
                type = 'error';
            }

            if (required && !value) {
                type = 'error';
                message = 'Ce champs est obligatoire';
            }

            if (!required && !value) {
                type = 'valid';
                message = '';
            }

            if ((valid || (valid && required)) && value) {
                type = 'valid';
                message = '';
            }

            setValidInfos((prev) => ({
                ...prev,
                message: mode === 'silent' ? '' : message,
                type,
            }));
        },
        [required, validatorConfig.validators]
    );

    return { checkField, ...validInfos };
};

export default useValidator;
