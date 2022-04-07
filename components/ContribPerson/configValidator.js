export const configValidator = {
    gender: {
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
    birthDate: {
        required: true,
    },
    deathDate: {
        required: true,
    },
    comment: {
        required: false,
    },
    activity: {
        required: false,
    },
    lastName: {
        required: true,
        validators: [
            (value) => ({
                valid: value.length > 2,
                errorMsg: '3 caractères minimum',
            }),
        ],
    },
    otherNames: {
        required: false,
        validators: [
            (value) => ({
                valid: value.length > 2,
                errorMsg: '3 caractères minimum',
            }),
        ],
    },
};
