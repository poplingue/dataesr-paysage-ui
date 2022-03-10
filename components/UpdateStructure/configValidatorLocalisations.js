export const configValidatorLocalisations = {
    country: {
        required: true,
    },
    locality: {
        required: true,
    },
    telephone: {
        required: false,
    },
    postOfficeBoxNumber: {
        required: false,
    },
    postalCode: {
        required: true,
        validators: [
            (value) => ({
                valid: value.length === 5 && !!value.match(/^[0-9]{5}$/),
                errorMsg: '5 caractères, uniquement des chiffres',
            }),
        ],
    },
    latitude: {
        validators: [
            (value) => ({
                valid: !!value.match(
                    /^((\-?|\+?)?\d+(\.\d+)?)[,|.]\s*((\-?|\+?)?\d+(\.\d+)?)/gm
                ),
                errorMsg: 'Respectez le format latitude',
            }),
        ],
        required: false,
    },
    longitude: {
        validators: [
            (value) => ({
                valid: !!value.match(
                    /^((\-?|\+?)?\d+(\.\d+)?)[,|.]\s*((\-?|\+?)?\d+(\.\d+)?)/gm
                ),
                errorMsg: 'Respectez le format longitude',
            }),
        ],
        required: false,
    },
    address: {
        required: true,
    },
    place: {
        required: false,
    },
    startDate: {
        required: false,
    },
    endDate: {
        required: false,
    },
    startDateDay: {
        required: false,
    },
    startDateMonth: {
        required: false,
    },
    startDateYear: {
        required: false,
    },
    endDateDay: {
        required: false,
    },
    endDateMonth: {
        required: false,
    },
    endDateYear: {
        required: false,
    },
    departments: {
        required: true,
        validators: [
            (value) => ({
                valid: value.length > 1,
                errorMsg: 'error msg departments',
            }),
        ],
    },
};
