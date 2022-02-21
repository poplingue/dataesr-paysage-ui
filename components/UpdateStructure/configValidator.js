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
    test: {
        required: true,
    },
    article: {
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
        required: false,
    },
    shortName: {
        required: false,
    },
    brandName: {
        required: false,
    },
    nameEn: {
        required: false,
    },
    acronymFr: {
        required: false,
    },
    acronymEn: {
        required: false,
    },
    otherNames: {
        required: false,
    },
    wikidata: {
        required: false,
        validators: [
            (value) => ({
                valid: value.length > 2,
                errorMsg: 'error msg wikidata',
            }),
        ],
    },
    type: {
        required: true,
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
    title: {
        required: true,
    },
    rnsr: {
        required: true,
        validators: [
            (value) => ({
                valid: value.length > 2,
                errorMsg: 'error msg rndr',
            }),
        ],
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
    state: {
        required: true,
    },
    typology: {
        required: true,
    },
    satisfaction: {
        required: true,
    },
    tutelle: {
        required: false,
    },
};
