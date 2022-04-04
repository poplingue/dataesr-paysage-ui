export const configValidator = {
    siret: {
        required: true,
        validators: [
            (value) => ({
                valid: value.length > 2,
                errorMsg: 'error msg siret',
            }),
        ],
    },
    article: {
        required: false,
    },
    category: {
        required: false,
    },
    officialName: {
        validators: [
            (value) => ({
                valid: value.length > 2,
                errorMsg: 'Au moins 2 caractères',
            }),
        ],
        required: true,
    },
    usualName: {
        validators: [
            (value) => ({
                valid: value.length > 2,
                errorMsg: 'Nom usuel invalide',
            }),
        ],
        required: true,
    },
    shortName: {
        required: false,
    },
    comment: {
        required: false,
    },
    brandName: {
        required: false,
    },
    nameEn: {
        validators: [
            (value) => ({
                valid: !!value.match(/^[a-zA-Z\s]*$/g),
                errorMsg: 'Uniquement des lettres',
            }),
        ],
        required: false,
    },
    acronymFr: {
        required: false,
    },
    acronymLocal: {
        required: false,
    },
    acronymEn: {
        required: false,
    },
    otherNames: {
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
