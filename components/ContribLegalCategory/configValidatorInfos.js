export const configValidator = {
    insee: {
        required: false,
    },
    wikidata: {
        required: false,
    },
    officialDocumentId: {
        required: true,
    },
    comment: {
        required: false,
    },
    inPublicResearch: {
        required: false,
    },
    legalPersonality: {
        required: false,
    },
    sector: {
        required: false,
    },
    longNameFr: {
        required: false,
    },
    longNameEn: {
        required: false,
    },
    shortNameFr: {
        required: false,
    },
    acronymFr: {
        required: false,
    },
    acronymEn: {
        required: false,
    },
    shortNameEn: {
        required: false,
    },
    pluralNameFr: {
        required: false,
    },
    pluralNameEn: {
        required: false,
    },
    otherNames: {
        required: false,
    },
    descriptionFr: {
        required: false,
    },
    websiteFr: {
        required: false,
    },
    websiteEn: {
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
