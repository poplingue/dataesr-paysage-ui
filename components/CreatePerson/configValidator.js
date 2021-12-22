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
    genre: {
        required: true,
    },
    firstName: {
        required: true,
        validators: [
            (value) => ({
                valid: value.length > 2,
                errorMsg: '3 caractères minimum',
            }),
        ],
    },
    satisfaction: {
        required: true,
    },
    lastName: {
        required: false,
        validators: [
            (value) => ({
                valid: value.length > 2,
                errorMsg: '3 caractères minimum',
            }),
        ],
    },
    otherName: {
        required: false,
        validators: [
            (value) => ({
                valid: value.length > 2,
                errorMsg: '3 caractères minimum',
            }),
        ],
    },
};
