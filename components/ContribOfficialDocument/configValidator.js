export const configValidator = {
    type: {
        required: true,
    },
    nature: {
        required: true,
    },
    documentNumber: {
        required: true,
    },
    title: {
        required: true,
    },
    pageUrl: {
        validators: [
            (value) => ({
                valid: !!value.match(/^(ftp|http|https):\/\/[^ "]+$/g),
                errorMsg: 'url invalide',
            }),
        ],
        required: true,
    },
    signatureDate: {
        required: true,
    },
    startDate: {
        required: true,
    },
    previsionalEndDate: {
        required: false,
    },
    endDate: {
        required: false,
    },
    textExtract: {
        required: false,
    },
    comment: {
        required: false,
    },
};
