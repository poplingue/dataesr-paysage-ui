export const configValidator = {
    wikidata: {
        required: true,
        validators: [
            (value) => ({
                valid: value.length > 2,
                errorMsg: '3 caractères minimum',
            }),
        ],
    },
    idref: {
        required: true,
        validators: [
            (value) => ({
                valid: value.length > 2 && !!value.match(/^\d+(\.\d{1,2})?$/),
                errorMsg: '3 caractères minimum, uniquement numériques',
            }),
        ],
    },
    satisfaction: {
        required: true,
    },
    uai: {
        required: false,
        validators: [
            (value) => ({
                valid: value.length > 2 && !!value.match(/^\d+(\.\d{1,2})?$/),
                errorMsg: '3 caractères minimum, uniquement numériques',
            }),
        ],
    },
};
