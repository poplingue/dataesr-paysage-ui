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
    otherName: {
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
        required: true,
    },
    endDate: {
        required: true,
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
