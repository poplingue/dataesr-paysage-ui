export const configValidator = {
    inseeCode: {
        required: true,
        validators: [
            (value) => ({
                valid: value.length === 5 && !!value.match(/^[0-9]{5}$/),
                errorMsg: '5 caractères, uniquement des chiffres',
            }),
        ],
    },
    longNameFr: {
        required: false,
    },
    shortNameFr: {
        required: false,
    },
    acronymeFr: {
        required: false,
    },
    pluralNameFr: {
        required: false,
    },
    descriptionFr: {
        required: false,
    },
    longNameEn: {
        required: false,
    },
    shortNameEn: {
        required: false,
    },
    legalPersonality: {
        required: false,
    },
    otherNames: {
        required: false,
    },
    sector: {
        required: false,
    },
    officialDocumentId: {
        required: false,
    },
    inPublicResearch: {
        required: false,
    },
    websiteFr: {
        required: false,
    },
    websiteEn: {
        required: false,
    },
    wikidataId: {
        required: false,
    },
    comment: {
        required: false,
    },
};
