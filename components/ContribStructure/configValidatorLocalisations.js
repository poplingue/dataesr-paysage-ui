export const configValidator = {
    country: {
        required: false,
    },
    cityId: {
        required: false,
        validators: [
            (value) => ({
                valid: value.length === 5 && !!value.match(/^[0-9]{5}$/),
                errorMsg: '5 caractères, uniquement des chiffres',
            }),
        ],
    },
    locality: {
        required: false,
    },
    distributionStatement: {
        required: false,
    },
    telephone: {
        required: false,
    },
    postOfficeBoxNumber: {
        required: false,
    },
    postalCode: {
        required: false,
        validators: [
            (value) => ({
                valid: value.length === 5 && !!value.match(/^[0-9]{5}$/),
                errorMsg: '5 caractères, uniquement des chiffres',
            }),
        ],
    },
    lat: {
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
    lng: {
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
        required: false,
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
        validators: [
            (value) => ({
                valid: !!value.match(/^\d{4}$/g),
                errorMsg: 'Format non valide',
            }),
        ],
        required: false,
    },
    endDateDay: {
        required: false,
    },
    endDateMonth: {
        required: false,
    },
    endDateYear: {
        validators: [
            (value) => ({
                valid: !!value.match(/^\d{4}$/g),
                errorMsg: 'Format non valide',
            }),
        ],
        required: false,
    },
};
