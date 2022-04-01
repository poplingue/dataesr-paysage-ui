export const configValidator = {
    usualNameEn: {
        required: false,
    },
    usualNameFr: {
        required: true,
    },
    comment: {
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
