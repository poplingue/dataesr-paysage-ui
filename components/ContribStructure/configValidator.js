export const configValidator = {
    creationDate: {
        required: true,
    },
    descriptionFr: {
        required: false,
    },
    descriptionEn: {
        required: false,
    },
    creationReason: {
        required: false,
    },
    closureReason: {
        required: false,
    },
    creationOfficialDocumentId: {
        validators: [
            (value) => ({
                valid: !!value.match(/^[a-zA-Z0-9]{8}$/g),
                errorMsg: 'Format non valide',
            }),
        ],
        required: false,
    },
    closureOfficialDocumentId: {
        validators: [
            (value) => ({
                valid: !!value.match(/^[a-zA-Z0-9]{8}$/g),
                errorMsg: 'Format non valide',
            }),
        ],
        required: false,
    },
    closureDate: {
        required: true,
    },
};
